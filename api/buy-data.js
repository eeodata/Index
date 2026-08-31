export default async function handler(req, res) {
 if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 const { phone, data_plan_id, network } = req.body;
 if (!phone || !data_plan_id) return res.status(400).json({ error: 'Phone and plan required' });

 try {
   const username = process.env.MBC_USERNAME;
   const password = process.env.MBC_PASSWORD;
   console.log('Trying MBC with username:', username); // Log username

   const authString = Buffer.from(`${username}:${password}`).toString('base64');

   const tokenRes = await fetch('https://mbcdata.com/api/user/', {
     method: 'POST',
     headers: { 'Authorization': `Basic ${authString}`, 'Content-Type': 'application/json' }
   });
   
   const tokenText = await tokenRes.text(); // Get raw text
   console.log('MBC raw response:', tokenText);
   
   let tokenData;
   try { tokenData = JSON.parse(tokenText); } catch(e) { tokenData = { raw: tokenText } }

   if (tokenData.status !== 'success') {
     return res.status(400).json({ error: `MBC Auth Failed: ${JSON.stringify(tokenData)} | User: ${username}` });
   }

   // If reach here, token success - continue buy...
   const accessToken = tokenData.accessToken;
   const buyRes = await fetch('https://mbcdata.com/api/data/', {
     method: 'POST',
     headers: { 'Authorization': `Token ${accessToken}`, 'Content-Type': 'application/json' },
     body: JSON.stringify({
       network: parseInt(network) || 1,
       phone: phone.trim(),
       data_plan: parseInt(data_plan_id),
       bypass: false,
       'request-id': `Data_${Date.now()}`
     })
   });

   const result = await buyRes.json();
   return res.status(200).json(result);

 } catch (err) {
   console.error(err);
   return res.status(500).json({ error: 'MBC Error: ' + err.message });
 }
}
