import ChatMessage from '../models/ChatMessage.js';

// Get chat history for a user
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const messages = await ChatMessage.find({ user: userId }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (error) {
        console.error('Get Chat History Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Send a message (and get bot response)
export const sendMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Save user message
        const userMsg = await ChatMessage.create({
            user: userId,
            message,
            isBot: false
        });

        // Generate bot response (Simple Rule-based)
        let botResponseText = "I'm not sure how to help with that. Try asking about 'events', 'tickets', or 'registration'.";

        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            botResponseText = "Hello! How can I assist you with EventSphere today?";
        } else if (lowerMsg.includes('event')) {
            botResponseText = "You can view all upcoming events on the Events page. Teachers can create new events from their dashboard.";
        } else if (lowerMsg.includes('ticket')) {
            botResponseText = "Once you register for an event and it's approved, your ticket will be generated. You can find it in 'My Events'.";
        } else if (lowerMsg.includes('register')) {
            botResponseText = "To register for an event, simply click the 'Register' button on the event details page.";
        } else if (lowerMsg.includes('contact') || lowerMsg.includes('help')) {
            botResponseText = "You can contact support at support@eventsphere.com or visit our Help Center.";
        }

        // Save bot response
        const botMsg = await ChatMessage.create({
            user: userId,
            message: botResponseText,
            isBot: true
        });

        res.json({ userMessage: userMsg, botMessage: botMsg });
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
