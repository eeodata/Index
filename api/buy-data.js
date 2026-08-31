export default async function handler(req, res) {
 if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
 const { phone, data_plan_id, network } = req.body;
 if (!phone || !data_plan_id) return res.status(400).json({ error: 'Phone and plan required' });
 try {
   const apiKey = process.env.MBC_API_KEY;
   if (!apiKey) return res.status(400).json({ error: 'No MBC_API_KEY for Vercel' });
   const buyRes = await fetch('https://mbcdata.com/api/data/', {
     method: 'POST',
     headers: { 'Authorization': `Token ${apiKey.trim()}`, 'Content-Type': 'application/json' },
     body: JSON.stringify({
       network: parseInt(network)||1,
       phone: phone.trim(),
       data_plan: parseInt(data_plan_id),
       bypass: false,
       'request-id': `Data_${Date.now()}`
     })
   });
   const text = await buyRes.text();
   let result; try{ result = JSON.parse(text); }catch{ result = {raw:text} }
   console.log(result);
   if (result.status === 'success') return res.status(200).json({ success: true, message: result.message || 'Success!' });
   return res.status(400).json({ error: result.message || result.response || text });
 } catch(e){ return res.status(500).json({ error: e.message }); }
}
