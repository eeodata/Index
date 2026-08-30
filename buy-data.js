export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
  
  const { network, data_plan, mobile_number } = req.body;
  
  try {
    const response = await fetch('https://datastation.com.ng/api/data/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DATASTATION_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        network: network, // 1=MTN, 2=GLO
        data_plan: data_plan,
        mobile_number: mobile_number,
        Ported_number: true
      })
    });
    
    const result = await response.json();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
