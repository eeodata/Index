export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { network, phone, plan } = req.body;
  const API_KEY = process.env.DATASTATION_KEY;

  console.log('Buying data:', { network, phone, plan });

  if (!API_KEY) {
    return res.status(500).json({ error: 'DATASTATION_KEY not set in Vercel' });
  }

  try {
    const response = await fetch('https://datastation.com.ng/api/data/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Token ${API_KEY}`
      },
      body: JSON.stringify({
        network: parseInt(network),
        mobile_number: phone,
        plan: parseInt(plan),
        Ported_number: true
      })
    });

    const data = await response.json();
    console.log('DataStation response:', data);
    return res.status(200).json(data);
    
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
