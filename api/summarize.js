export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { links, style, schedule, deliveryTime, deliveryMethods } = req.body;

  if (!links || links.length === 0) return res.status(400).json({ error: 'No links provided' });

  const styleInstructions = {
    long: 'Write a detailed, comprehensive summary for each item. Include key insights, main arguments, and important details. Use headers for each item.',
    short: 'Write a concise 2-3 sentence summary for each item. Focus on the single most important takeaway.',
    bullets: 'Summarize each item as 3-5 bullet points. Each bullet should be a key insight or takeaway. Be scannable and direct.'
  };

  const prompt = `You are a content digest assistant. Summarize the following ${links.length} piece(s) of content.

Style: ${styleInstructions[style] || styleInstructions.bullets}

Content links to summarize:
${links.map((l, i) => `${i + 1}. [${l.type?.toUpperCase() || 'LINK'}] ${l.url}${l.channelName ? ` (Channel: ${l.channelName})` : ''}`).join('\n')}

Since you cannot access these URLs directly, create a realistic and helpful summary based on what these URLs suggest about the content. For YouTube channels and podcast feeds, acknowledge they are ongoing sources.

Format your response clearly with each item labeled.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error');

    const summary = data.content[0]?.text || 'No summary generated.';
    res.status(200).json({ summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
