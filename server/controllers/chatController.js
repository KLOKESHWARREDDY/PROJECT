import ChatMessage from '../models/ChatMessage.js';

// CHAT CONTROLLER - Handles chatbot conversations
// This controller manages chat history and AI bot responses

// GET CHAT HISTORY - Returns all messages for current user
// Step 1: Get user ID from authentication middleware
// Step 2: Query MongoDB for messages matching user ID
// Step 3: Sort by timestamp (oldest first for chat flow)
// Step 4: Return messages array
// Request: GET /api/chat/history (requires authentication)
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

// SEND MESSAGE - Process user message and generate bot response
export const sendMessage = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role || 'student'; // Default to student if role missing
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

        // Generate bot response using advanced logic
        console.log(`[ChatDebug] Received message: "${message}" from role: ${userRole}`);
        const botResponseText = determineBotResponse(message, userRole, req.user.name);
        console.log(`[ChatDebug] Determined response: "${botResponseText.substring(0, 50)}..."`);

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

// HELPER: Determine Bot Response based on intent and user role
const determineBotResponse = (message, role, userName) => {
    const lowerMsg = message.toLowerCase();
    const firstName = userName ? userName.split(' ')[0] : 'there';

    // --- IDENTITY & GREETINGS ---
    if (lowerMsg.match(/\b(hi|hello|hey|greetings|morning|afternoon|evening)\b/)) {
        return `Hello ${firstName}. I am the EventSphere Assistant. How can I help you today?`;
    }
    if (lowerMsg.includes('who are you') || lowerMsg.includes('what are you')) {
        return "I am the EventSphere Assistant. I can help you with events, registrations, tickets, and account settings.";
    }

    // --- FEATURE EXPLANATIONS ---

    // 1. Create Event (Teacher Only)
    if (lowerMsg.includes('create event') || lowerMsg.includes('host event') || lowerMsg.includes('make event')) {
        if (role === 'teacher') {
            return `To create an event:
            \n1. Go to your Dashboard.
            \n2. Click "Create Event".
            \n3. Fill in details like title, date, time, location, and upload an image.
            \n4. Click "Publish Event" to make it live.`;
        } else {
            return `Event creation is for Teachers only.
            \n• As a Student, you can browse and register for events.
            \n• If you need to host events, you must log in with a Teacher account.`;
        }
    }

    // 2. Register for Event (Student Only)
    if (lowerMsg.includes('register') || lowerMsg.includes('join event') || lowerMsg.includes('attend')) {
        if (role === 'student') {
            return `To register for an event:
            \n1. Browse events on the "Events" page.
            \n2. Click on an event to see details.
            \n3. Click "Register".
            \n4. Check "My Events" to see your status.`;
        } else {
            return "Teachers cannot register for events as participants. You can manage events you created from your Dashboard.";
        }
    }

    // 3. Registration Status (Pending/Approved/Rejected)
    if (lowerMsg.includes('status') || lowerMsg.includes('pending') || lowerMsg.includes('approved') || lowerMsg.includes('rejected')) {
        return `About registration statuses:
        \n• **Pending**: The event organizer handles this. Please wait for them to review.
        \n• **Approved**: You are confirmed! You can view your ticket.
        \n• **Rejected**: The organizer declined your registration. You cannot attend this event.`;
    }

    // 4. Tickets
    if (lowerMsg.includes('ticket') || lowerMsg.includes('download')) {
        return `To get your ticket:
        \n1. Go to "My Events".
        \n2. Find an "Approved" event.
        \n3. Click "View Ticket" to see the QR code and details.
        \n4. You can print this page or show it at the venue.`;
    }

    // 5. Profile & Password
    if (lowerMsg.includes('profile') || lowerMsg.includes('photo') || lowerMsg.includes('picture')) {
        return `To update your profile:
        \n1. Go to "Profile" in the menu.
        \n2. Click "Edit Profile".
        \n3. You can change your name, bio, and upload a new profile picture.`;
    }
    if (lowerMsg.includes('change password') || lowerMsg.includes('reset password')) {
        return `To change your password:
        \n1. Go to "Settings".
        \n2. Select "Change Password".
        \n3. Enter your current password and the new one.
        \nFor forgotten passwords, log out and use "Forgot Password" on the login screen.`;
    }

    // 6. Notifications
    if (lowerMsg.includes('notification') || lowerMsg.includes('alert')) {
        return `Check your "Notifications" tab for updates on:
        \n• Registration approvals/rejections.
        \n• New events from teachers you follow.
        \n• Reminders for upcoming events.`;
    }

    // --- PROBLEM SOLVING ---

    // 1. Technical Errors
    if (lowerMsg.includes('error') || lowerMsg.includes('not working') || lowerMsg.includes('bug')) {
        return `I'm sorry you're facing an issue.
        \n1. Try refreshing the page.
        \n2. Log out and log back in.
        \n3. If it persists, please contact support with details.`;
    }

    // 2. Cancel Registration
    if (lowerMsg.includes('cancel')) {
        return `To cancel a registration:
        \n1. Go to "My Events".
        \n2. Click "Cancel" on the event card.
        \nNote: If you are already approved, please contact the organizer if needed.`;
    }

    // --- FALLBACK ---
    return "I can help with questions about Events, Registrations, Tickets, Profile, and Settings. What would you like to know?";
};
