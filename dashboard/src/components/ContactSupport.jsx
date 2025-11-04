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
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const res = await fetch(getApiUrl("/api/support/contact"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, subject, purpose, message }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Check if response is ok before parsing JSON
        let data;
        try {
          data = await res.json();
        } catch (parseError) {
          console.error('Failed to parse response:', parseError);
          throw new Error('Server returned an invalid response. Please try again later.');
        }
        
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to send message");
        }
        
        setNotice({ type: "success", text: data.message || "Message sent successfully. We will get back to you shortly." });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setPurpose("General inquiry");
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // Handle abort (timeout)
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        throw fetchError;
      }
    } catch (err) {
      console.error('Support email submission error:', err);
      // Provide more specific error messages
      let errorMessage = err.message || "Failed to send message.";
      
      if (err.name === 'AbortError' || err.message?.includes('timeout')) {
        errorMessage = "Request timed out. Please check your connection and try again.";
      } else if (err.message?.includes('fetch') || 
                 err.message?.includes('network') || 
                 err.message?.includes('Failed to fetch') ||
                 err.message?.includes('NetworkError')) {
        errorMessage = "Network error. Please check your connection and try again. If the problem persists, contact us directly at gjain0229@gmail.com";
      } else if (err.message?.includes('CORS') || err.message?.includes('CORS policy')) {
        errorMessage = "Connection error. Please try again or contact us directly at gjain0229@gmail.com";
      }
      
      setNotice({ type: "error", text: errorMessage });
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