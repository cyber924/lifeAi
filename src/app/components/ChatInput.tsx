'use client'

import { useState } from 'react';

interface ChatInputProps {
  onSubmit: (query: string) => void;
}

export function ChatInput({ onSubmit }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="여행, 맛집, 쇼핑 등 무엇이든 물어보세요!"
          className="w-full p-4 pl-6 pr-24 text-gray-800 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-colors"
        >
          전송
        </button>
      </div>
    </form>
  );
}
