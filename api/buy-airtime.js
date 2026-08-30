export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { network, phone, amount } = req.body;

  if (!network || !phone || !amount) {
    return res.status(400).json({
      error: 'Missing fields',
      message: 'network, phone, amount required'
    });
  }

  if (amount < 100 || amount > 5000) {
    return res.status(400).json({
      error: 'Amount must be 100-5000'
    });
  }

  try {
    const response = await fetch('https://datastation.com.ng/api/topup/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${process.env.DATASTATION_KEY}`
      },
      body: JSON.stringify({
        network: network.toUpperCase(),
        amount: parseInt(amount),
        mobile_number: phone,
        Ported_number: true,
        airtime_type: 'VTU'
      })
    });

    const data = await response.json();

    if (response.ok && data.Status === 'successful') {
      return res.status(200).json({
        status: 'success',
        message: `₦${amount} airtime sent to ${phone}`,
        data
      });
    } else {
      return res.status(400).json({
        status: 'failed',
        message: data.api_response || 'Airtime failed',
        data
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: 'Server error'
    });
  }
}
