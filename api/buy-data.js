export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { network, phone, plan } = req.body;

  if (!network || !phone || !plan) {
    return res.status(400).json({ 
      error: 'Missing fields',
      message: 'network, phone, plan required' 
    });
  }

  try {
    // DataStation integration
    const response = await fetch('https://datastation.com.ng/api/data/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.DATASTATION_KEY}`
      },
      body: JSON.stringify({
        network: network.toLowerCase(),
        mobile_number: phone,
        plan: plan,
        Ported_number: true
      })
    });

    const data = await response.json();

    if (response.ok && data.Status === 'successful') {
      return res.status(200).json({
        status: 'success',
        message: `${plan} delivered to ${phone}`,
        data
      });
    } else {
      return res.status(400).json({
        status: 'failed',
        message: data.api_response || 'Data purchase failed',
        data
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ 
      error: 'Server error',
      message: 'Could not process request' 
    });
  }
}
