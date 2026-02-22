const OpenAI = require('openai');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
(async () => {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'hello' }],
            temperature: 0.7,
            max_tokens: 50
        });
        console.log("SUCCESS:", completion.choices[0].message.content);
    } catch (e) {
        console.error("OPENAI ERROR:", e);
    }
})();
