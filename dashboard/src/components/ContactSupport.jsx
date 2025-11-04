import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from '../config/api';

const isValidEmail = (value) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

const ContactSupport = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("General inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice({ type: "", text: "" });

    if (!name.trim() || !email.trim() || !message.trim()) {
      setNotice({ type: "error", text: "All fields are required." });
      return;
    }
    if (!isValidEmail(email.trim())) {
      setNotice({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setSubmitting(true);
      const apiUrl = getApiUrl("/api/support/contact");
      console.log('📧 [FRONTEND] Sending email request to:', apiUrl);
      console.log('📧 [FRONTEND] Request payload:', { name, email, subject, purpose, messageLength: message.length });
      
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, purpose, message })
      });
      
      console.log('📧 [FRONTEND] Response status:', res.status, res.statusText);
      
      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error('📧 [FRONTEND] Non-JSON response:', text);
        throw new Error(`Server returned ${res.status}: ${text.substring(0, 100)}`);
      }
      
      const data = await res.json();
      console.log('📧 [FRONTEND] Response data:', data);
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to send message");
      }
      
      setNotice({ type: "success", text: data.message || "Message sent successfully." });
      setSubject("");
      setMessage("");
      setName("");
      setEmail("");
    } catch (err) {
      console.error('📧 [FRONTEND] Error sending email:', err);
      console.error('📧 [FRONTEND] Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      setNotice({ 
        type: "error", 
        text: err.message || "Failed to send message. Please check your connection and try again." 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Contact Support</h1>
      <p className="text-sm text-gray-500 mb-6">You can reach us at <span className="font-medium text-gray-700">gjain0229@gmail.com</span> or send a message using the form below.</p>

      {notice.text && (
        <div className={`mb-4 rounded-md px-4 py-3 text-sm ${notice.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {notice.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-5 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user?.name || "Gaurav Jain"}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={user?.email || "you@example.com"}
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Short summary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contact Purpose</label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>General inquiry</option>
              <option>Login issue</option>
              <option>Orders</option>
              <option>Funds</option>
              <option>Positions</option>
              <option>Bug report</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your issue or request"
              required
            />
          </div>
        </div>

        <div className="mt-5">
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactSupport;