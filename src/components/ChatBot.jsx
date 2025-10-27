import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your disaster safety assistant. I can provide tips on hurricane preparedness, evacuation routes, emergency supplies, and more. How can I help you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    // TODO: Replace with your actual AI API endpoint (OpenAI, Claude, etc.)
    // For now, providing rule-based responses for common disaster safety questions
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hurricane') || lowerMessage.includes('storm')) {
      return 'Hurricane Safety Tips:\n\n1. Stay indoors away from windows\n2. Have at least 3 days of water and non-perishable food\n3. Keep flashlights and batteries ready\n4. Charge all electronic devices\n5. Know your evacuation route\n6. Listen to local emergency broadcasts\n7. Secure outdoor objects\n8. If evacuating, do so early';
    } else if (lowerMessage.includes('evacuat')) {
      return 'Evacuation Guidelines:\n\n1. Follow official evacuation orders immediately\n2. Take your emergency kit\n3. Bring important documents\n4. Tell someone where you\'re going\n5. Use recommended evacuation routes\n6. Don\'t drive through flooded areas\n7. Turn off utilities if instructed\n8. Lock your home';
    } else if (lowerMessage.includes('supply') || lowerMessage.includes('kit')) {
      return 'Emergency Supply Kit Essentials:\n\n1. Water (1 gallon per person per day)\n2. Non-perishable food (3-day supply)\n3. First aid kit\n4. Flashlight and extra batteries\n5. Battery-powered radio\n6. Medications (7-day supply)\n7. Important documents in waterproof container\n8. Cash\n9. Phone chargers\n10. Basic tools';
    } else if (lowerMessage.includes('flood')) {
      return 'Flood Safety:\n\n1. Move to higher ground immediately\n2. Never walk or drive through flood water\n3. Stay away from power lines\n4. Turn off utilities if safe to do so\n5. Don\'t return home until authorities say it\'s safe\n6. Document damage with photos\n7. Avoid contaminated water';
    } else if (lowerMessage.includes('power') || lowerMessage.includes('electricity')) {
      return 'Power Outage Safety:\n\n1. Keep freezers/fridges closed\n2. Use flashlights, not candles\n3. Turn off/unplug appliances\n4. Keep generators outside\n5. Use battery-powered devices\n6. Stay away from downed power lines\n7. Conserve phone battery';
    } else {
      return 'I can help with:\n\n• Hurricane & storm preparedness\n• Evacuation procedures\n• Emergency supply kits\n• Flood safety\n• Power outage tips\n• General disaster preparedness\n\nWhat would you like to know more about?';
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call backend API with Gemini integration
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply
        }]);
      } else {
        // If API key not configured, use fallback responses
        const fallbackResponse = await getAIResponse(inputMessage);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: fallbackResponse
        }]);
      }
    } catch (error) {
      // Use fallback responses if backend is not available
      const fallbackResponse = await getAIResponse(inputMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackResponse
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-primary text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MessageCircle size={24} />
              <span className="font-semibold">Disaster Safety AI</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-600 rounded p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader className="animate-spin" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about disaster safety..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-primary hover:bg-blue-600 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;

