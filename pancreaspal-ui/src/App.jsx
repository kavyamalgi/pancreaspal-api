import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { ChatPage } from './pages/ChatPage';
import { FAQPage } from './pages/FAQPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
