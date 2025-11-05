/**
 * Email Service - Resend REST API Integration
 * Fast, reliable email service using Resend REST API (not SMTP)
 * Works perfectly on Render production
 */

// Use built-in fetch (Node.js 18+) or require node-fetch for older versions
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  fetch = require('node-fetch');
}

class EmailService {
  constructor() {
    this.apiKey = null;
    this.isInitialized = false;
    this.initializeService();
  }

  initializeService() {
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        console.error('❌ Resend API key missing. Please set RESEND_API_KEY environment variable.');
        this.isInitialized = false;
        return;
      }

      // Validate API key format
      if (!apiKey.startsWith('re_')) {
        console.warn('⚠️ Resend API key should start with "re_". Please verify your API key.');
      }

      this.apiKey = apiKey;
      this.isInitialized = true;

      console.log('📧 Initializing Resend email service (REST API)...');
      console.log('📧 API Key:', apiKey.substring(0, 10) + '...');
      console.log('✅ Resend email service initialized successfully (REST API)');
    } catch (error) {
      console.error('❌ Error initializing Resend email service:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Send email using Resend REST API
   */
  async sendEmail({ to, subject, html, text, replyTo, from }) {
    if (!this.isInitialized || !this.apiKey) {
      throw new Error('Email service not initialized. Please check RESEND_API_KEY environment variable.');
    }

    // Always use onboarding@resend.dev (works without verification)
    const fromEmail = from || process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const fromName = process.env.EMAIL_FROM_NAME || 'StockSathi Support';
    const supportTo = to || process.env.SUPPORT_TO || 'gjain0229@gmail.com';

    // Validate required fields
    if (!supportTo || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, or html');
    }

    console.log('📤 Sending email via Resend REST API:', {
      to: supportTo,
      from: `${fromName} <${fromEmail}>`,
      subject: subject,
      hasReplyTo: !!replyTo
    });

    try {
      // Use Resend REST API (much faster than SMTP on Render)
      const payload = {
        from: `${fromName} <${fromEmail}>`,
        to: [supportTo],
        subject: subject,
        html: html,
        ...(text && { text: text }),
        ...(replyTo && { reply_to: [replyTo] })
      };

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      let response;
      try {
        response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Email send timeout after 30 seconds');
        }
        throw fetchError;
      }

      const responseData = await response.json();

      if (!response.ok) {
        console.error('❌ Resend API error:', {
          status: response.status,
          statusText: response.statusText,
          response: responseData
        });

        let userMessage = 'Failed to send email. Please try again later.';
        
        if (response.status === 401 || response.status === 403) {
          userMessage = 'Email authentication failed. Please check RESEND_API_KEY is valid.';
        } else if (response.status === 422) {
          userMessage = responseData.message || 'Invalid email configuration. Please check email settings.';
        } else if (response.status === 429) {
          userMessage = 'Email rate limit exceeded. Please try again later.';
        } else if (responseData.message) {
          userMessage = `Email service error: ${responseData.message}`;
        }

        throw {
          code: response.status,
          message: responseData.message || response.statusText,
          userMessage: userMessage,
          responseCode: response.status,
          responseMessage: responseData.message
        };
      }

      console.log('✅ Email sent successfully via Resend REST API:', {
        id: responseData.id,
        to: supportTo,
        from: `${fromName} <${fromEmail}>`
      });

      return {
        success: true,
        messageId: responseData.id,
        accepted: [supportTo],
        rejected: []
      };

    } catch (error) {
      // Handle fetch timeout or network errors
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        console.error('❌ Email send timeout:', error);
        throw {
          code: 'ETIMEDOUT',
          message: 'Email send timeout. Please try again later.',
          userMessage: 'Email send timeout. Please try again later.',
          originalError: error
        };
      }

      // Handle other errors
      if (error.code && error.userMessage) {
        // Already formatted error from above
        throw error;
      }

      console.error('❌ Email send error:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          hasApiKey: !!this.apiKey
        }
      });

      throw {
        code: error.code,
        message: error.message,
        userMessage: 'Failed to send email. Please try again later.',
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
