// MBC DATA API - MTN ONLY
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});

  const { phone, data_plan_id } = req.body; // data_plan_id = e.g. 1, 2, 3 etc from MBC

  if (!phone || !data_plan_id) return res.status(400).json({error: 'Phone and plan required'});

  try {
    // 1. GET TOKEN from MBC
    const username = process.env.MBC_USERNAME;
    const password = process.env.MBC_PASSWORD;
    const authString = Buffer.from(`${username}:${password}`).toString('base64');

    const tokenRes = await fetch('https://mbcdata.com/api/user', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      }
    });
    const tokenData = await tokenRes.json();
    if (tokenData.status !== 'success') throw new Error('MBC Token failed');
    
    const accessToken = tokenData.accessToken;

    // 2. BUY DATA
    const formattedPhone = phone.startsWith('0') ? '234' + phone.slice(1) : phone;
    const requestId = `Data_${Date.now()}`;

    const buyRes = await fetch('https://mbcdata.com/api/data', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        network: 1, // MTN = 1
        phone: formattedPhone,
        data_plan: parseInt(data_plan_id),
        bypass: false,
        "request-id": requestId
      })
    });

    const result = await buyRes.json();
    
    if (result.status === 'success' || result.message?.includes('gifted')) {
      return res.status(200).json({ success: true, message: result.message });
    } else {
      return res.status(400).json({ error: result.message || 'Failed' });
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'MBC Error: ' + err.message });
  }
        }
