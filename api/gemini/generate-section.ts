import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { sectionType, productName, category, keyFeatures, promptInstructions } = body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in server environment. Please set GEMINI_API_KEY.',
      });
    }

    const systemPrompt = `You are a Product Manager and Technical Service Plan Specialist for consumer audio products (boAt, Sony, JBL style).
Generate realistic, highly accurate, industry-standard technical service plan data for:
Product Name: ${productName || 'Audio Device'}
Category: ${category || 'TWS'}
Key Features: ${keyFeatures || 'Standard features'}
Target Section Type: ${sectionType}
Specific Instructions: ${promptInstructions || 'Generate comprehensive standard data'}

Return strict JSON corresponding to the section content schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: systemPrompt,
      config: { responseMimeType: 'application/json', temperature: 0.4 },
    });

    const generatedData = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: generatedData });
  } catch (error: any) {
    console.error('Gemini generate section error:', error);
    return res.status(500).json({ error: error?.message || 'Generation failed' });
  }
}
