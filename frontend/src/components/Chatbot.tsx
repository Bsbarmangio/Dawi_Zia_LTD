import React, { useState, useRef, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  XMarkIcon, 
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { chatbotApi } from '../utils/api';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant from Dawi Zia LTD. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await chatbotApi.chat(inputMessage, sessionId || undefined);
      const { sessionId: newSessionId, message: botResponse } = response.data.data;
      
      if (!sessionId) {
        setSessionId(newSessionId);
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again or contact our support team.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickQuestions = [
    'Tell me about your companies',
    'What raw materials do you offer?',
    'Show me animal medicines',
    'How can I contact you?'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl transition-all duration-300 z-50 flex flex-col ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}>
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <SparklesIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-xs text-primary-100">Always here to help</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isBot
                    ? 'bg-secondary-100 text-secondary-800'
                    : 'bg-primary-600 text-white'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isBot ? 'text-secondary-500' : 'text-primary-100'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary-100 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-secondary-500 mb-2">Quick questions:</p>
            <div className="space-y-1">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="w-full text-left text-xs p-2 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors text-secondary-700"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-secondary-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};