// MBC DATA API - MTN ONLY - FINAL FIX
export default async function handler(req, res) {
 if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 const { phone, data_plan_id, network } = req.body;
 if (!phone || !data_plan_id) return res.status(400).json({ error: 'Phone and plan required' });

 try {
   const username = process.env.MBC_USERNAME;
   const password = process.env.MBC_PASSWORD;
   const authString = Buffer.from(`${username}:${password}`).toString('base64');

   const tokenRes = await fetch('https://mbcdata.com/api/user/', {
     method: 'POST',
     headers: { 'Authorization': `Basic ${authString}`, 'Content-Type': 'application/json' }
   });
   const tokenData = await tokenRes.json();
   if (tokenData.status !== 'success') throw new Error('MBC Token failed');
   const accessToken = tokenData.accessToken;

   // NO 234 conversion - MBC wants 081...
   const formattedPhone = phone.trim();
   const requestId = `Data_${Date.now()}`;

   const buyRes = await fetch('https://mbcdata.com/api/data/', {
     method: 'POST',
     headers: { 'Authorization': `Token ${accessToken}`, 'Content-Type': 'application/json' },
     body: JSON.stringify({
       network: parseInt(network) || 1,
       phone: formattedPhone,
       data_plan: parseInt(data_plan_id),
       bypass: false,
       'request-id': requestId
     })
   });

   const result = await buyRes.json();
   if (result.status === 'success' || result.message?.toLowerCase().includes('gifted')) {
     return res.status(200).json({ success: true, message: result.message || 'Data sent!' });
   } else {
     return res.status(400).json({ error: result.message || result.response || 'Failed' });
   }
 } catch (err) {
   console.error(err);
   return res.status(500).json({ error: 'MBC Error: ' + err.message });
 }
}
