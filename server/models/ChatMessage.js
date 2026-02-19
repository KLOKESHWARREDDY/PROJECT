import mongoose from 'mongoose';

/**
 * ChatMessage Model
 * =============================================================================
 * Purpose: Stores chat messages for the AI chatbot feature
 * 
 * This model captures all conversations between users and the chatbot.
 * Messages can be from users or from the bot (AI responses).
 * 
 * Schema Fields:
 * - user: Reference to the user who sent/received the message
 * - message: The actual text content
 * - isBot: Flag to identify bot messages (true = bot, false = user)
 * - timestamp: When the message was sent
 * 
 * Use Cases:
 * - User asks a question -> isBot: false
 * - Bot responds with answer -> isBot: true
 * =============================================================================
 */

const chatMessageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isBot: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ChatMessage', chatMessageSchema);
