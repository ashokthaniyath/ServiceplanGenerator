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
    const { text, targetTone, context } = body;
    const ai = getGeminiClient();

    if (!ai) {
      // Local fallback simple transform
      let polished = text || '';
      if (targetTone === 'technical_sop') {
        polished = polished.replace(/simply /gi, '').replace(/please /gi, '').replace(/you can /gi, 'Service personnel must ');
      }
      return res.json({ polishedText: polished, isAi: false });
    }

    const prompt = `Rewrite the following audio service plan text to match the tone '${targetTone}'.
Tone options:
- 'technical_sop': Strict, imperative, concise step-by-step diagnostic manual phrasing.
- 'customer_facing': Empathetic, polite, clear consumer troubleshooting tone.
- 'executive_summary': High-level, punchy, specification-focused overview.
- 'boat_brand': boAt lifestyle energetic and bold tech tone with trademarked terms (IWP™, ASAP™ Charge, BEAST™ Mode, AI-ENx™).

Context: ${context || 'Audio device service manual'}
Input Text:
${text}

Return strict JSON: { "polishedText": "string", "changes": "brief summary of improvements" }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.3 },
    });

    const parsed = JSON.parse(response.text || '{"polishedText": ""}');
    return res.json({
      polishedText: parsed.polishedText || text,
      changes: parsed.changes || 'Tone adjusted.',
      isAi: true,
    });
  } catch (error: any) {
    console.error('Gemini polish tone error:', error);
    return res.status(500).json({ error: error?.message || 'Tone polish failed' });
  }
}
