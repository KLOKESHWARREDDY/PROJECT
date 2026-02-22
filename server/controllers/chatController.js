import ChatMessage from '../models/ChatMessage.js';
import { GoogleGenAI } from '@google/genai';

// Lazy initialization of Gemini to ensure environment variables are loaded by server.js first
let geminiInstance = null;
const getGemini = () => {
    if (!geminiInstance) {
        geminiInstance = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }
    return geminiInstance;
};

const SYSTEM_PROMPT = `
You are the official AI Assistant for EventSphere, a smart college event management platform. 
Your role is to practically, step-by-step help students and teachers navigate the platform. 

CRITICAL BEHAVIOR RULES:
1. Scope strictness: Do not answer questions outside the scope of college events, the EventSphere platform, or academics. Politely decline any off-topic queries immediately.
2. Tone: Maintain a helpful, enthusiastic, professional, and clear tone. Always complete your sentences and provide thorough, step-by-step "1, 2, 3" guidance.
3. Format: Always format event schedules, instructions, or feature lists using clean markdown bullet points or numbered lists. Use bold text for UI buttons like **"Login"**.
4. Escalation: If a user asks a question about ticket refunds, technical issues you cannot resolve, or anything else requiring human intervention, provide the contact email: eventsupport@college.edu.

PLATFORM FEATURES & WORKFLOWS (Your Knowledge Base):

1. ACCOUNTS & ROLES
- The platform has two roles: "Teacher" (organizers) and "Student" (attendees). 
- To sign up, they must use a valid @gmail.com account.
- If they forget their password, point them to the "Forgot Password" link on the login page via email to get a reset link.

2. EVENT MANAGEMENT (TEACHERS ONLY)
- Event Creation: 1) Go to the Dashboard, 2) Click **"Create Event"**, 3) Fill in the event details (title, dates, category, location, image), and 4) Click **"Publish Event"** or **"Save Draft"**. 
- Important: Only published events are visible to students.
- Registration Approvals: Teachers can review students who register for their events. From the Dashboard, they click into the event, view the registration pane, and click **"Approve"** or **"Reject"**. 
- They can also use "Approve All" to mass accept students.

3. REGISTERING FOR EVENTS (STUDENTS ONLY)
- Finding Events: 1) Browse the **"Events"** page or use the Search Bar, 2) Click on an event card to read the description and view the location.
- Registering: 3) Click the **"Register"** button on the event's detail page.
- Registration Statuses:
  - **Pending**: The event organizer must review the registration.
  - **Approved**: Confirmed! A ticket is generated.
  - **Rejected**: Registration denied by the organizer.

4. TICKETS & ATTENDANCE (STUDENTS)
- Downloading Tickets: Once 'Approved', go to **"My Events"**, click **"View Ticket"**, and you can download or print the QR code ticket. This QR code will be scanned by teachers at the venue.

5. SETTINGS & PROFILE
- Updating Profile: Go to **"Profile"** > **"Edit Profile"** in the navigation menu to change bio, name, or upload a photo.
- Changing Password: Under **"Settings"** > **"Change Password"**.
- Notifications: Users receive alerts for new events, registration approvals, and rejections via the bell icon on the top right.

Remember: You have access to the user's role and name in this system prompt context. Rely on their role to give accurate advice (e.g., politely inform a student they cannot create events, or inform a teacher they do not need to register for their own events). You do not have direct DB access to realtime events, so always advise users to check the "Events" page.
`;

// GET CHAT HISTORY - Returns all messages for current user
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
        const userRole = req.user.role || 'student';
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

        // Retrieve last 10 messages for conversation context
        const messageHistoryRecords = await ChatMessage.find({ user: userId })
            .sort({ timestamp: -1 })
            .limit(10);

        // Reverse them so they are chronological
        messageHistoryRecords.reverse();

        // Format history for Gemini API
        // Exclude the user message we just saved to avoid duplicates
        const formattedHistory = messageHistoryRecords
            .filter(msg => msg._id.toString() !== userMsg._id.toString())
            .map(msg => ({
                role: msg.isBot ? 'model' : 'user',
                parts: [{ text: msg.message }]
            }));

        // Append the current user message at the very end
        formattedHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const systemInstruction = `${SYSTEM_PROMPT}\n\nThe user you are talking to has the role: ${userRole}. Their name is ${req.user.name || 'Student'}.`;

        try {
            // Call Gemini API
            const ai = getGemini();
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: formattedHistory,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            });

            const botResponseText = response.text;

            // Save bot response
            const botMsg = await ChatMessage.create({
                user: userId,
                message: botResponseText,
                isBot: true
            });

            res.json({ userMessage: userMsg, botMessage: botMsg });
        } catch (geminiError) {
            console.error('Gemini API Error:', geminiError);

            // Fallback bot response in case Gemini is down or API key is invalid
            const fallbackBotMsg = await ChatMessage.create({
                user: userId,
                message: "I'm currently experiencing technical difficulties connecting to my brain. Please try again later or contact eventsupport@college.edu if you need immediate assistance.",
                isBot: true
            });

            return res.json({ userMessage: userMsg, botMessage: fallbackBotMsg });
        }
    } catch (error) {
        console.error('Send Message Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
