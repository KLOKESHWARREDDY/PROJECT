import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '../api';
import './ChatBot.css';

const ChatBot = ({ user, isOpen, setIsOpen }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial greeting
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    _id: 'init',
                    message: "Hi! I'm the EventSphere Assistant. How can I help you today?",
                    isBot: true,
                    timestamp: new Date()
                }
            ]);
        }
    }, []);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    // Fetch history if logged in
    useEffect(() => {
        if (isOpen && user) {
            const fetchHistory = async () => {
                try {
                    const res = await api.get('/chat/history');
                    if (res.data && res.data.length > 0) {
                        setMessages(res.data);
                    }
                } catch (error) {
                    console.error("Failed to load chat history", error);
                }
            };
            fetchHistory();
        }
    }, [isOpen, user]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const tempId = Date.now();
        const userMsg = {
            _id: tempId,
            message: input,
            isBot: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
/* Subheading or description text */
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (token) {
                // Authenticated chat
                const res = await api.post('/chat/send', { message: userMsg.message });
/* Container for the toggle switch between user types */
                setMessages(prev => {
                    // Replace temp message if needed, or just append bot response
                    // Here we just append the real saved messages from DB to be safe, 
                    // or just append bot response if we want to accept the optimistic update
                    return [...prev.filter(m => m._id !== tempId), res.data.userMessage, res.data.botMessage];
                });
            } else {
                // Unauthenticated fallback (simulated)
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        _id: Date.now() + 1,
                        message: "Please sign in to chat with our support bot.",
                        isBot: true,
                        timestamp: new Date()
                    }]);
                }, 500);
            }
        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, {
                _id: Date.now() + 1,
                message: "Sorry, I'm having trouble connecting right now.",
                isBot: true,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={28} />
                </button>
            )}

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <h3>EventSphere Support</h3>
                        <button className="chatbot-close" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg) => (
                            <div key={msg._id || Math.random()} className={`message ${msg.isBot ? 'bot' : 'user'}`}>
                                {msg.message}
                            </div>
                        ))}
                        {isLoading && <div className="message bot">Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbot-input" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !input.trim()}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
