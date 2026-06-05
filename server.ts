import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: path.join(process.cwd(), 'src', '.env') });

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization utility for Gemini API to ensure no module-load-time crashes
function getAiClient() {
  let key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY' || key.trim() === '') {
    console.warn('GEMINI_API_KEY is not defined. Falling back to local offline generator.');
    return null;
  }

  // Strip any accidental leading/trailing single or double quotes
  key = key.trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1);
  }

  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. AI Behavior Reflection Endpoint (Accepts purchase history and evaluates patterns)
app.post('/api/reflect', async (req, res) => {
  const { purchases } = req.body;

  if (!purchases || !Array.isArray(purchases)) {
    return res.status(400).json({ error: 'Purchases list is required and must be an array.' });
  }

  const client = getAiClient();

  if (!client) {
    // Elegant fallback mock data when no api key is found so user code keeps working perfectly
    const purchaseSummaries = purchases.map(p => `${p.name} (${p.category}, $${p.price})`).join(', ');
    return res.json({
      summary: `Based on your recent clothing purchases (such as: ${purchaseSummaries || 'your tracked items'}), your shopping habits point to a mild frequency in apparel. You have high awareness in brands, but duplicate purchases suggest an opportunity to focus more on lasting value over transient needs. Let's work together to boost your sustainability score.`,
      questions: [
        'Do you already own products in your closet that serve the same purpose or look identical?',
        `What emotional trigger or discount promotion motivated your latest purchase of clothing?`,
        'Was this purchase a long-term necessity, or could you have waited 30 days before deciding?',
        'Could you continue repairing, restyling, or substituting with your current garments instead?'
      ],
      suggestions: [
        {
          title: 'Style an Alternative Combination',
          description: 'Before buying another item, challenge yourself to create 5 new outfit combinations using solely clothing pieces already hanging in your closet.',
          type: 'creative'
        },
        {
          title: 'Organize a Wardrobe Exchange',
          description: 'Host or participate in a sustainable clothing swap event with colleagues or friends to refresh your styling options without contributing to textile waste.',
          type: 'swap'
        },
        {
          title: 'The 30-Day Solitude Rule',
          description: 'Implement a mandatory 30-day "cool-down" period for non-essential purchases. Leave the items in the digital checkout cart to verify if they are genuine needs.',
          type: 'reuse'
        }
      ]
    });
  }

  try {
    const purchaseContext = purchases.map(p => {
      return `- Product: ${p.name}, Category: ${p.category}, Brand: ${p.brand}, Price: $${p.price}, Purchased On: ${p.date}`;
    }).join('\n');

    const prompt = `Analyze the user's purchase history. Focus heavily on overconsumption, duplicated category purchases, spending distribution, and fast fashion trends.
Generate a supportive, educational, non-judgmental analysis. Provide exactly:
1. A summary paragraph (approx 3-4 sentences in a supportive coaching tone).
2. exactly 4 personalized reflection questions to prompt self-reflection.
3. exactly 3 alternative action card recommendations (such as reusing, buying second-hand, wardrobe swaps, or restyling).

User's tracked purchases:
${purchaseContext || 'Currently no purchases recorded.'}

Provide the output in valid, strict JSON matching this database structure:
{
  "summary": "Coaching analysis paragraph here",
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4"
  ],
  "suggestions": [
    {
      "title": "Action title",
      "description": "Elaborated action instruction",
      "type": "reuse" or "repair" or "swap" or "secondhand" or "creative"
    }
  ]
}`;

    const response = await client.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['summary', 'questions', 'suggestions'],
          properties: {
            summary: { type: Type.STRING, description: 'Supportive coaching summary paragraph' },
            questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exactly 4 custom counseling/reflection questions'
            },
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['title', 'description', 'type'],
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['reuse', 'repair', 'swap', 'secondhand', 'creative'] }
                }
              },
              description: 'Exactly 3 customized eco-friendly recommendation cards'
            }
          }
        },
        systemInstruction: 'You are a warm, supportive, and expert eco-sustainability behavioral coach specialized in SDG 12.8 (responsible consumption). Your mission is to analyze consumer habits, point out overconsumption risks gently, trigger critical introspection, and suggest sustainable choices without any shaming or judgmental language.'
      }
    });

    const text = response.text;
    res.json(JSON.parse(text || '{}'));
  } catch (error: any) {
    console.error('Gemini Reflection API error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate reflection analysis' });
  }
});

// 2. Chat Coach Endpoint (Interactive consumption advisor)
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages are required and must be an array.' });
  }

  const client = getAiClient();

  if (!client) {
    // Offline local Coach response generator
    const lastMessage = messages[messages.length - 1]?.text || '';
    let mockReply = "I am here as your Sustainable Consumption Coach. Let's analyze how we can work towards UN Sustainable Development Goal 12.8, reduce our ecological foot-print, and design a conscious wardrobe!";
    
    const msgLower = lastMessage.toLowerCase();
    if (msgLower.includes('harmful') || msgLower.includes('fast fashion')) {
      mockReply = "Fast Fashion is highly resource-intensive and accounts for up to 10% of global carbon emissions and massive amounts of textile waste in landfills. To counter this, we can commit to purchasing durable items, looking for certified ethical labels, and practicing the 'Rule of 30 wears'—only buying what we know we will wear at least 30 times.";
    } else if (msgLower.includes('impulse') || msgLower.includes('reduce')) {
      mockReply = "Reducing impulse buying involves creating a 'cooling off' period. Try the 48-hour or 30-day rule: delay purchasing any non-essential item for a set period. Often, the transient emotional urge to shop passes and you realize the item isn't truly necessary. Focusing on styling your current pieces or repairing old items is also highly effective.";
    } else if (msgLower.includes('wardrobe') || msgLower.includes('build')) {
      mockReply = "Building a sustainable wardrobe starts with what you already own! First, do a complete inventory of your closet. Next, follow the '5 Rs' of fashion: Rethink, Reduce, Respect, Repair, and Reuse. Invest in versatile, timeless core products made with durable fibers like organic cotton, linen, or recycled polymers, and explore second-hand thrift stores first.";
    } else if (msgLower.includes('responsible') || msgLower.includes('example')) {
      mockReply = "Examples of responsible consumption under SDG 12.8 include: choosing repairs over replacements, participating in community clothing swaps, thrift-shopping for retro garments, buying products made from high-quality recycled post-consumer waste, and actively utilizing digital consumption dashboards like EcoReflect AI to hold yourself accountable.";
    }

    return res.json({ text: mockReply });
  }

  try {
    // Map existing client messages to the core Gemini content system.
    // Ensure accurate roles: model and user are the acceptable types.
    const formattedContents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await client.models.generateContent({
      model: 'gemini-flash-latest',
      contents: formattedContents,
      config: {
        systemInstruction: `You are the Sustainable Consumption Coach for the EcoReflect AI platform. 
Your primary goal is supporting UN Sustainable Development Goal 12.8: ensuring that consumers everywhere have the relevant information and awareness for sustainable development and lifestyles in harmony with nature.

Core Directives:
1. Increase user awareness of fast fashion, carbon emissions, water pollution, and massive textile landfill waste.
2. Focus on young consumers (18-30 years old) influenced by online micro-trends, social advertisements, and impulse promotions.
3. Be highly supportive, educational, empathetic, and encouraging.
4. Avoid any criticism, judgment, or finger-pointing. Never shame users for their shopping habits.
5. Provide actionable choices: buying high-quality/durable pieces, caring for outfits, repairing garments, sewing, clothes swaps, buying second-hand, or styling smart creative capsules.
6. Trigger introspection: "What emotional gap does this shopping fulfill? Is there an existing garment that works?".
7. Keep responses warm, structured, and easy to read. Use bullet points and paragraphs elegantly.`
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini Chat API error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate chat response' });
  }
});

// Start dev server (mounting Vite) or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in Development mode.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static rendering mounted.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoReflect AI Express server running on port ${PORT}`);
  });
}

startServer();
