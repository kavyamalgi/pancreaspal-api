import React, { useState, useRef } from 'react';
import { useChatStore } from '../context/chatStore';
import { patientService } from '../services/apiService';
import { MessageList } from '../components/MessageList';
import { ChatInput } from '../components/ChatInput';
import { Disclaimer } from '../components/Disclaimer';

function PancreasIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="13" y="3" width="6" height="26" rx="3" fill="#94a3b8" />
      <rect x="3" y="13" width="26" height="6" rx="3" fill="#94a3b8" />
    </svg>
  );
}

export function ChatPage() {
  const { currentMessages, addMessage, setLoading, isLoading } = useChatStore();
  const [patientId, setPatientId] = useState(() => localStorage.getItem('currentPatientId') || '');
  const [uploadStatus, setUploadStatus] = useState(
    localStorage.getItem('currentPatientId') ? 'ready' : 'idle'
  );
  const [uploadedFilename, setUploadedFilename] = useState(
    localStorage.getItem('uploadedFilename') || ''
  );
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadStatus('error');
      return;
    }

    setUploadStatus('uploading');
    try {
      const response = await patientService.uploadPDF(file);
      const id = response.data.patient_id;
      setPatientId(id);
      setUploadedFilename(file.name);
      localStorage.setItem('currentPatientId', id);
      localStorage.setItem('uploadedFilename', file.name);
      setUploadStatus('ready');
    } catch (err) {
      console.error('Upload error:', err?.response?.data || err.message);
      setUploadStatus('error');
    }
  };

  const handleSendMessage = async (message) => {
    addMessage({ role: 'user', content: message, timestamp: new Date().toISOString() });
    setLoading(true);
    try {
      const response = await patientService.query(patientId, message);
      addMessage({
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources,
        timestamp: new Date().toISOString()
      });
    } catch {
      addMessage({
        role: 'assistant',
        content: 'Sorry, I could not get a response. Please try again.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Pill rendered inside the glass card when a file is loaded
  const filePill = uploadStatus === 'ready' ? (
    <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-700 rounded-full px-3 py-1 text-xs max-w-xs">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <span className="truncate">{uploadedFilename}</span>
    </div>
  ) : uploadStatus === 'uploading' ? (
    <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 rounded-full px-3 py-1 text-xs">
      <span>Uploading…</span>
    </div>
  ) : uploadStatus === 'error' ? (
    <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-500 rounded-full px-3 py-1 text-xs">
      <span>Upload failed — please try a valid PDF</span>
    </div>
  ) : null;

  const hasMessages = currentMessages.length > 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {hasMessages ? (
        <>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-2xl mx-auto">
              <MessageList messages={currentMessages} isLoading={isLoading} />
            </div>
          </div>
          <div className="px-4 pb-6">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-2">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!patientId}
                filePill={filePill}
                onUploadClick={() => fileInputRef.current?.click()}
                compact
              />
              <Disclaimer />
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl flex flex-col items-center -mt-10">
            {/* Heading block */}
            <div className="flex flex-col items-center mb-7">
              <PancreasIcon />
              <h1
                className="text-5xl text-gray-900 mt-4 mb-3 text-center tracking-tight"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 300, letterSpacing: '-0.5px' }}
              >
                I'm your Pancreas Pal!
              </h1>
              <p
                className="mt-5 text-sm text-slate-400 text-center tracking-widest uppercase"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400 }}
              >
                Ask me anything
              </p>
            </div>

            {/* Glass input card */}
            <div className="w-full">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                disabled={!patientId}
                filePill={filePill}
                onUploadClick={() => fileInputRef.current?.click()}
              />
            </div>
            <div className="mt-3">
              <Disclaimer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
