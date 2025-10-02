import React, { useEffect, useState } from "react";

const FaqItem = ({ q, a, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
      >
        <span className="font-medium text-gray-900">{q}</span>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-700 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

const Faqs = () => {
  const [items, setItems] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:3000/api/support/faqs");
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to load FAQs");
        setItems(data.items || []);
      } catch (err) {
        setError(err.message || "Failed to load FAQs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">FAQs & Guides</h1>
      <p className="text-sm text-gray-500 mb-6">Beginner-friendly answers to common stock market questions.</p>

      {loading && (
        <div className="text-gray-600">Loading FAQs...</div>
      )}
      {error && !loading && (
        <div className="mb-4 rounded-md px-4 py-3 text-sm bg-red-50 text-red-700 border border-red-200">{error}</div>
      )}

      {!loading && !error && (
        <div className="max-w-3xl">
          {items.map((faq) => (
            <FaqItem
              key={faq.id}
              q={faq.question}
              a={faq.answer}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Faqs;


