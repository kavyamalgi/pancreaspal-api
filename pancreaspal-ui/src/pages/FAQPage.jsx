import React from 'react';
import { useNavigate } from 'react-router-dom';

const faqItems = [
  {
    q: 'What is Pancreas Pal?',
    a: 'Pancreas Pal is an AI-powered educational chatbot designed to help you learn about pancreatic health, conditions, and general wellness. It provides clear, accessible information based on your questions — think of it as a knowledgeable companion, not a doctor.'
  },
  {
    q: 'Who can use Pancreas Pal and how do I get started?',
    a: 'Anyone curious about pancreatic health can use Pancreas Pal. To get started, simply type your question into the chat box on the home page. No account or sign-up is required to ask questions.'
  },
  {
    q: 'Where does Pancreas Pal get my health information from?',
    a: 'Pancreas Pal draws on information from its underlying AI model, which has been trained on a broad range of medical and scientific literature. It does not access your personal health records or any external databases in real time.'
  },
  {
    q: 'How is my health information protected?',
    a: 'Pancreas Pal does not store or share the questions you ask. Conversations are not linked to any personally identifiable information. Please avoid entering sensitive personal details such as your full name, date of birth, or contact information.'
  },
  {
    q: 'How do I know Pancreas Pal is safe to use?',
    a: 'Pancreas Pal is designed strictly as an educational tool. It will not diagnose conditions, prescribe treatments, or replace professional medical advice. For any health concern, always consult a licensed healthcare professional. In an emergency, call your local emergency services immediately.'
  }
];

export function FAQPage() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/')}
          className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors mb-10"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          ← Back to chat
        </button>

        <h1
          className="text-3xl text-gray-900 mb-2"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Frequently Asked Questions
        </h1>
        <p
          className="text-gray-500 mb-10 text-sm"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          About Pancreas Pal
        </p>

        <div className="space-y-8">
          {faqItems.map((item, i) => (
            <div key={i} className="border-b border-gray-100 pb-8 last:border-b-0">
              <h2
                className="text-base font-semibold text-gray-900 mb-2"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {item.q}
              </h2>
              <p
                className="text-sm text-gray-600 leading-relaxed"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
