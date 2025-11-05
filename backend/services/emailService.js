const nodemailer = require('nodemailer');

/**
 * Email Service - Resend Integration
 * Clean, production-ready email service using Resend API
 */

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || 'onboarding@resend.dev';
      const fromName = process.env.EMAIL_FROM_NAME || 'StockSathi Support';

      if (!apiKey) {
        console.error('❌ Resend API key missing. Please set RESEND_API_KEY environment variable.');
        this.transporter = null;
        this.isInitialized = false;
        return;
      }

      // Validate API key format
      if (!apiKey.startsWith('re_')) {
        console.warn('⚠️ Resend API key should start with "re_". Please verify your API key.');
      }

      console.log('📧 Initializing Resend email service...');
      console.log('📧 From email:', fromEmail);
      console.log('📧 From name:', fromName);

      // Create Resend transporter
      this.transporter = nodemailer.createTransport({
        host: 'smtp.resend.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: 'resend',
          pass: apiKey
        },
        connectionTimeout: 30000,
        greetingTimeout: 30000,
        socketTimeout: 60000
      });

      this.isInitialized = true;
      console.log('✅ Resend email transporter initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Resend email service:', error);
      this.transporter = null;
      this.isInitialized = false;
    }
  }

  /**
   * Verify email service connection
   */
  async verifyConnection() {
    if (!this.transporter) {
      throw new Error('Email transporter not initialized. Please check RESEND_API_KEY environment variable.');
    }

    try {
      await this.transporter.verify();
      console.log('✅ Email service connection verified');
      return true;
    } catch (error) {
      console.error('❌ Email service connection verification failed:', error);
      throw error;
    }
  }

  /**
   * Send email using Resend
   */
  async sendEmail({ to, subject, html, text, replyTo, from }) {
    if (!this.transporter || !this.isInitialized) {
      throw new Error('Email service not initialized. Please check RESEND_API_KEY environment variable.');
    }

    // Resend requires verified domain or use onboarding@resend.dev
    // IMPORTANT: Use onboarding@resend.dev for both localhost and production
    // It works without verification and is perfect for support emails
    let fromEmail = from || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
    
    // Always use onboarding@resend.dev if custom email is not verified
    // For production, if you want custom email, verify your domain first in Resend
    // For now, force onboarding@resend.dev to ensure emails work
    if (fromEmail && fromEmail !== 'onboarding@resend.dev') {
      console.warn(`⚠️  Custom FROM email detected: ${fromEmail}`);
      console.warn('⚠️  Resend requires domain verification for custom emails.');
      console.warn('⚠️  Switching to onboarding@resend.dev (works without verification)');
      console.warn('⚠️  Note: Vercel domains (stocksathi.vercel.app) cannot be verified - use your own domain');
      fromEmail = 'onboarding@resend.dev';
    } else {
      fromEmail = 'onboarding@resend.dev';
    }
    const fromName = process.env.EMAIL_FROM_NAME || 'StockSathi Support';
    const supportTo = to || process.env.SUPPORT_TO || 'gjain0229@gmail.com';
    
    // Log email configuration for debugging
    console.log('📧 Email configuration:', {
      from: `${fromName} <${fromEmail}>`,
      to: supportTo,
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 10) + '...' : 'missing'
    });

    // Validate required fields
    if (!supportTo || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, or html');
    }

    const mailOptions = {
      from: {
        name: fromName,
        address: fromEmail
      },
      to: supportTo,
      subject: subject,
      html: html,
      ...(text && { text: text }),
      ...(replyTo && { replyTo: replyTo })
    };

    console.log('📤 Sending email via Resend:', {
      to: supportTo,
      from: `${fromName} <${fromEmail}>`,
      subject: subject,
      hasReplyTo: !!replyTo
    });

    try {
      // Try to verify connection (optional - don't fail if it fails)
      try {
        await this.verifyConnection();
      } catch (verifyError) {
        console.warn('⚠️ Connection verification failed, but continuing with send:', verifyError.message);
      }

      // Send email with timeout protection
      const sendPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 30 seconds')), 30000)
      );

      const info = await Promise.race([sendPromise, timeoutPromise]);
      
      // Check if email was actually accepted
      const wasAccepted = info.accepted && info.accepted.length > 0;
      const wasRejected = info.rejected && info.rejected.length > 0;
      
      console.log('📧 Email send result:', {
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected,
        acceptedCount: info.accepted?.length || 0,
        rejectedCount: info.rejected?.length || 0
      });

      // If email was rejected, throw error
      if (wasRejected || !wasAccepted) {
        const rejectionReason = info.rejected && info.rejected.length > 0 
          ? info.rejected[0] 
          : 'Email was not accepted by the server';
        
        console.error('❌ Email was rejected:', {
          rejected: info.rejected,
          response: info.response,
          messageId: info.messageId
        });
        
        throw new Error(`Email delivery failed: ${rejectionReason}`);
      }

      console.log('✅ Email sent successfully and accepted:', {
        messageId: info.messageId,
        accepted: info.accepted,
        response: info.response
      });

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
        accepted: info.accepted,
        rejected: info.rejected
      };
    } catch (error) {
      console.error('❌ Email send error:', {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        responseMessage: error.responseMessage,
        message: error.message,
        stack: error.stack
      });

      // Provide user-friendly error messages
      let userMessage = 'Failed to send email. Please try again later.';
      
      if (error.code === 'EAUTH' || error.responseCode === 401 || error.responseCode === 403) {
        userMessage = 'Email authentication failed. Please check RESEND_API_KEY is valid.';
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNECTION' || error.code === 'ESOCKET') {
        userMessage = 'Email service connection timeout. Please try again later.';
      } else if (error.message?.includes('timeout')) {
        userMessage = 'Email send timeout. Please try again later.';
      } else if (error.responseCode === 422) {
        // 422 usually means unverified domain/email or invalid FROM address
        if (error.message?.includes('from') || error.message?.includes('domain') || error.message?.includes('verify') || error.message?.includes('sender')) {
          userMessage = 'Email address not verified in Resend. The system will use onboarding@resend.dev automatically.';
        } else {
          userMessage = 'Invalid email configuration. Please check email settings.';
        }
      } else if (error.message?.includes('rejected') || error.message?.includes('not accepted')) {
        userMessage = 'Email was rejected by the server. Please check the email address and try again.';
      } else if (error.responseCode === 429) {
        userMessage = 'Email rate limit exceeded. Please try again later.';
      } else if (error.responseMessage) {
        // Use Resend's error message if available
        userMessage = `Email service error: ${error.responseMessage}`;
      }

      throw {
        code: error.code,
        message: error.message,
        userMessage: userMessage,
        responseCode: error.responseCode,
        responseMessage: error.responseMessage,
        originalError: error
      };
    }
  }

  /**
   * Send support email from Help & Support form
   */
  async sendSupportEmail({ name, email, subject, purpose, message }) {
    const mailSubject = subject && subject.trim() 
      ? `[StockSathi] ${subject}` 
      : `[StockSathi] Support: ${purpose || 'General inquiry'}`;

    // Escape HTML to prevent XSS
    const escapeHtml = (text) => {
      if (!text) return '';
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #0f172a; background: #f8fafc; padding: 20px; margin: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr>
                <th style="text-align: left; background: #0ea5e9; padding: 16px 20px; color: #ffffff; font-size: 18px; font-weight: 600;">
                  StockSathi Support Request
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9;">
                  <div style="color: #0f172a; font-weight: 600; font-size: 16px; margin-bottom: 8px;">New Support Request</div>
                  <div style="color: #475569;">You received a new message from the Help & Support form.</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; font-size: 14px; color: #0f172a;">
                    <tr>
                      <td style="width: 160px; color: #64748b; padding: 6px 0; vertical-align: top;">Name</td>
                      <td style="padding: 6px 0; font-weight: 500;">${escapeHtml(name)}</td>
                    </tr>
                    <tr>
                      <td style="width: 160px; color: #64748b; padding: 6px 0; vertical-align: top;">Email</td>
                      <td style="padding: 6px 0;">
                        <a href="mailto:${escapeHtml(email)}" style="color: #0ea5e9; text-decoration: none;">${escapeHtml(email)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 160px; color: #64748b; padding: 6px 0; vertical-align: top;">Purpose</td>
                      <td style="padding: 6px 0;">${escapeHtml(purpose || 'General inquiry')}</td>
                    </tr>
                    ${subject && subject.trim() ? `
                    <tr>
                      <td style="width: 160px; color: #64748b; padding: 6px 0; vertical-align: top;">Subject</td>
                      <td style="padding: 6px 0;">${escapeHtml(subject)}</td>
                    </tr>` : ''}
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 20px;">
                  <div style="color: #64748b; margin-bottom: 6px; font-weight: 500;">Message</div>
                  <div style="white-space: pre-wrap; line-height: 1.6; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; color: #0f172a;">${escapeHtml(message)}</div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 12px 20px; color: #94a3b8; font-size: 12px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
                  This email was sent by the StockSathi Support system. Reply directly to this email to respond to the user.
                </td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: process.env.SUPPORT_TO || 'gjain0229@gmail.com',
      subject: mailSubject,
      html: html,
      replyTo: email
    });
  }

  /**
   * Send email verification code
   */
  async sendVerificationEmail({ email, verificationCode, isWelcome = false }) {
    const mailSubject = `[StockSathi] Email Verification Code`;
    
    const escapeHtml = (text) => {
      if (!text) return '';
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #0f172a; background: #f8fafc; padding: 20px; margin: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr>
                <th style="text-align: left; background: #0ea5e9; padding: 16px 20px; color: #ffffff; font-size: 18px; font-weight: 600;">
                  StockSathi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9;">
                  <div style="color: #0f172a; font-weight: 600; font-size: 16px; margin-bottom: 8px;">
                    ${isWelcome ? 'Welcome to StockSathi!' : 'Email Verification'}
                  </div>
                  <div style="color: #475569;">
                    ${isWelcome 
                      ? 'Please use the following code to verify your email address and complete your registration.'
                      : 'Please use the following code to verify your email address.'
                    }
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 32px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; padding: 15px 0;">
                      ${escapeHtml(verificationCode)}
                    </div>
                    <div style="color: #64748b; margin-top: 10px;">This code will expire in 15 minutes.</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; background: #f1f5f9; text-align: center;">
                  <div style="color: #64748b; font-size: 12px;">
                    ${isWelcome 
                      ? 'If you didn\'t register for StockSathi, please ignore this email.'
                      : 'If you didn\'t request this code, please ignore this email.'
                    }
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: email,
      subject: mailSubject,
      html: html
    });
  }

  /**
   * Send password reset code
   */
  async sendPasswordResetEmail({ email, resetCode }) {
    const mailSubject = `[StockSathi] Password Reset Code`;
    
    const escapeHtml = (text) => {
      if (!text) return '';
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return String(text).replace(/[&<>"']/g, m => map[m]);
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #0f172a; background: #f8fafc; padding: 20px; margin: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 640px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr>
                <th style="text-align: left; background: #0ea5e9; padding: 16px 20px; color: #ffffff; font-size: 18px; font-weight: 600;">
                  StockSathi
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 16px 20px; border-bottom: 1px solid #f1f5f9;">
                  <div style="color: #0f172a; font-weight: 600; font-size: 16px; margin-bottom: 8px;">Password Reset</div>
                  <div style="color: #475569;">Please use the following code to reset your password.</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 32px; font-weight: bold; color: #0ea5e9; letter-spacing: 8px; padding: 15px 0;">
                      ${escapeHtml(resetCode)}
                    </div>
                    <div style="color: #64748b; margin-top: 10px;">This code will expire in 15 minutes.</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding: 16px 20px; background: #f1f5f9; text-align: center;">
                  <div style="color: #64748b; font-size: 12px;">
                    If you didn't request a password reset, please ignore this email.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    return await this.sendEmail({
      to: email,
      subject: mailSubject,
      html: html
    });
  }
}

// Export singleton instance
module.exports = new EmailService();
