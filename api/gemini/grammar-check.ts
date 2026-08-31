import { GoogleGenAI } from '@google/genai';

// Lazy initialize Gemini client (returns null when no API key is configured)
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
}

// Fallback local rule-based grammar checker (used when no Gemini key is present)
function localGrammarCheck(text: string, blockTitle: string, blockId: string, field: string) {
  const issues: any[] = [];
  const rules = [
    { regex: /\bteh\b/gi, fix: 'the', msg: 'Typo: "teh" should be "the"', type: 'spelling' },
    { regex: /\brecieve\b/gi, fix: 'receive', msg: 'Spelling error: "recieve" should be "receive"', type: 'spelling' },
    { regex: /\bseperate\b/gi, fix: 'separate', msg: 'Spelling error: "seperate" should be "separate"', type: 'spelling' },
    { regex: /\buntill\b/gi, fix: 'until', msg: 'Spelling error: "untill" should be "until"', type: 'spelling' },
    { regex: /\bfeautres\b/gi, fix: 'features', msg: 'Spelling error: "feautres" should be "features"', type: 'spelling' },
    { regex: /\btroubelshooting\b/gi, fix: 'troubleshooting', msg: 'Spelling error: "troubelshooting" should be "troubleshooting"', type: 'spelling' },
    { regex: /\bconatins\b/gi, fix: 'contains', msg: 'Spelling error: "conatins" should be "contains"', type: 'spelling' },
    { regex: /\bhaevy\b/gi, fix: 'heavy', msg: 'Spelling error: "haevy" should be "heavy"', type: 'spelling' },
    { regex: /\bprevise\b/gi, fix: 'preview', msg: 'Spelling error: "previse" should be "preview"', type: 'spelling' },
    { regex: /\bgrammer\b/gi, fix: 'grammar', msg: 'Spelling error: "grammer" should be "grammar"', type: 'spelling' },
    { regex: /\blanels\b/gi, fix: 'panels', msg: 'Spelling error: "lanels" should be "panels"', type: 'spelling' },
    { regex: /\bBoat\b(?! Airdopes| Rockerz| Nirvana| Hearables)/g, fix: 'boAt', msg: 'Brand naming guideline: Use "boAt" with lowercase "b" and uppercase "A"', type: 'technical_tone' },
    { regex: /\b10mins\b/gi, fix: '10 mins', msg: 'Formatting: Add space between number and unit ("10 mins")', type: 'formatting' },
    { regex: /\b4hrs\b/gi, fix: '4 hrs', msg: 'Formatting: Add space between number and unit ("4 hrs")', type: 'formatting' },
    { regex: /\b45ms\b/gi, fix: '45 ms', msg: 'Formatting: Add space between number and unit ("45 ms")', type: 'formatting' },
    { regex: /\bbluetooth\b/g, fix: 'Bluetooth', msg: 'Proper noun: "Bluetooth" should be capitalized', type: 'grammar' },
    { regex: /\btype-c\b/g, fix: 'Type-C', msg: 'Proper noun: "Type-C" should use proper capitalization', type: 'formatting' },
    { regex: /\bmic\b/gi, fix: 'microphone', msg: 'Style suggestion: Consider using "microphone" in official SOPs', type: 'technical_tone' },
  ];

  rules.forEach((rule, idx) => {
    if (rule.regex.test(text)) {
      const match = text.match(rule.regex)?.[0] || '';
      issues.push({
        id: `local-issue-${blockId}-${idx}-${Date.now()}`,
        blockId,
        blockTitle,
        field,
        originalText: match,
        suggestedText: rule.fix,
        explanation: rule.msg,
        type: rule.type,
      });
    }
  });

  return issues;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const blocks = body.blocks || body.document?.blocks;
    const docMetadata = body.docMetadata || body.document?.metadata;
    if (!blocks || !Array.isArray(blocks)) {
      return res.status(400).json({ error: 'Blocks array required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      const allIssues: any[] = [];
      for (const block of blocks) {
        if (!block.enabled) continue;
        const textToAnalyze = JSON.stringify(block.content || {});
        const localIssues = localGrammarCheck(textToAnalyze, block.title, block.id, 'content');
        allIssues.push(...localIssues);
      }
      return res.json({
        issues: allIssues,
        isAiGenerated: false,
        summary: `Rule-based scan complete. Found ${allIssues.length} recommendations.`,
      });
    }

    const samplePayload = blocks
      .filter((b: any) => b.enabled)
      .map((b: any) => ({ id: b.id, title: b.title, content: b.content }));

    const prompt = `You are a Senior Technical Documentation & Quality Assurance Editor for consumer electronics and audio devices (like boAt TWS earbuds, neckbands, and headphones).

Review the following Service Plan blocks for:
1. Spelling, grammar, and punctuation mistakes.
2. Technical terminology errors (e.g., proper capitalization like 'boAt', 'Bluetooth', 'Type-C', 'ASAP™ Charge', 'BEAST™ Mode', 'AI-ENx™', 'AAC/SBC', 'IPX5').
3. Clarity and concise procedural phrasing for service technician SOPs.
4. Readability and formatting improvements.

Document Target: ${docMetadata?.productName || 'Audio Device'} (${docMetadata?.category || 'TWS'})

Blocks to analyze:
${JSON.stringify(samplePayload, null, 2)}

Return a strict JSON response containing an array of detected issues with this exact schema:
{
  "issues": [
    {
      "id": "unique-string",
      "blockId": "block-id-from-input",
      "blockTitle": "Title of block",
      "field": "field name or key",
      "originalText": "exact erroneous text or sentence fragment",
      "suggestedText": "corrected replacement text",
      "explanation": "concise explanation of why this was corrected",
      "type": "spelling" | "grammar" | "clarity" | "technical_tone" | "formatting"
    }
  ],
  "summary": "Brief 1-sentence assessment of the document quality"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.2 },
    });

    const parsed = JSON.parse(response.text || '{"issues": [], "summary": "No issues found."}');
    return res.json({
      issues: parsed.issues || [],
      isAiGenerated: true,
      summary: parsed.summary || 'AI Quality audit complete.',
    });
  } catch (error: any) {
    console.error('Gemini grammar check error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to analyze grammar' });
  }
}
