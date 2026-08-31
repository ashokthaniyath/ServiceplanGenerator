import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Fallback local rule-based grammar checker
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

// Gemini Grammar & Quality Checker
app.post('/api/gemini/grammar-check', async (req, res) => {
  try {
    const blocks = req.body.blocks || req.body.document?.blocks;
    const docMetadata = req.body.docMetadata || req.body.document?.metadata;
    if (!blocks || !Array.isArray(blocks)) {
      return res.status(400).json({ error: 'Blocks array required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Offline fallback rule-based analysis
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

    // AI-powered grammar analysis using Gemini
    const samplePayload = blocks
      .filter((b: any) => b.enabled)
      .map((b: any) => ({
        id: b.id,
        title: b.title,
        content: b.content,
      }));

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
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{"issues": [], "summary": "No issues found."}');
    res.json({
      issues: parsed.issues || [],
      isAiGenerated: true,
      summary: parsed.summary || 'AI Quality audit complete.',
    });
  } catch (error: any) {
    console.error('Gemini grammar check error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze grammar' });
  }
});

// Gemini Section Auto-Generator
app.post('/api/gemini/generate-section', async (req, res) => {
  try {
    const { sectionType, productName, category, keyFeatures, promptInstructions } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured in server environment. Please check Settings > Secrets.',
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
      config: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    const generatedData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: generatedData });
  } catch (error: any) {
    console.error('Gemini generate section error:', error);
    res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

// Gemini Tone Polisher
app.post('/api/gemini/polish-tone', async (req, res) => {
  try {
    const { text, targetTone, context } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Local fallback simple transform
      let polished = text;
      if (targetTone === 'technical_sop') {
        polished = text.replace(/simply /gi, '').replace(/please /gi, '').replace(/you can /gi, 'Service personnel must ');
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
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{"polishedText": ""}');
    res.json({
      polishedText: parsed.polishedText || text,
      changes: parsed.changes || 'Tone adjusted.',
      isAi: true,
    });
  } catch (error: any) {
    console.error('Gemini polish tone error:', error);
    res.status(500).json({ error: error.message || 'Tone polish failed' });
  }
});

// Vite & Static Asset Handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Audio Service Plan Generator server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
