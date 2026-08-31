export default function handler(_req: any, res: any) {
  return res.json({
    status: 'ok',
    gemini: process.env.GEMINI_API_KEY ? 'configured' : 'offline-fallback',
    timestamp: new Date().toISOString(),
  });
}
