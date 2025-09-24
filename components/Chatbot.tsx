import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import { SendIcon, BotIcon, UserIcon } from './IconComponents';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm EcoWise. How can I help you save energy today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponseText = await getChatbotResponse(input);
      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I couldn't get a response. Please try again.", sender: 'ai' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="bg-surface-card rounded-xl shadow-card border border-steel flex flex-col h-[75vh] max-h-[800px] sticky top-8">
      <div className="p-4 border-b border-steel">
        <h3 className="text-lg font-semibold text-text-primary">Chat with EcoWise AI</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="p-1.5 bg-steel-dark rounded-full"><BotIcon className="w-6 h-6 text-cyan-glow" /></div>}
            <div className={`max-w-xs md:max-w-md lg:max-w-xs xl:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'ai' ? 'bg-steel text-text-primary rounded-tl-none' : 'bg-gradient-to-br from-cyan-glow to-cyan-dark text-steel-dark font-medium rounded-br-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <div className="p-1.5 bg-steel rounded-full"><UserIcon className="w-6 h-6 text-text-primary" /></div>}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="p-1.5 bg-steel-dark rounded-full"><BotIcon className="w-6 h-6 text-cyan-glow" /></div>
            <div className="max-w-xs px-4 py-3 rounded-2xl bg-steel text-text-primary rounded-tl-none">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-cyan-glow rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-cyan-glow rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-cyan-glow rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-steel">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about saving energy..."
            className="w-full pr-12 pl-4 py-2 border border-steel bg-steel-dark text-text-primary rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-glow"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gradient-to-br from-cyan-glow to-cyan-dark text-steel-dark hover:shadow-cyan-glow focus:outline-none focus:ring-2 focus:ring-cyan-glow disabled:bg-steel-light disabled:shadow-none"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};