export default async function handler(req, res) {
  try {
    const apiKey = process.env.MBC_API_KEY;
    // Try get all data plans from MBC
    const r = await fetch('https://mbcdata.com/api/data/plans/', {
      headers: { 'Authorization': `Token ${apiKey}` }
    });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    return res.status(200).json(data);
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
