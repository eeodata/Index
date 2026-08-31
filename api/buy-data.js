export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
 const {phone, data_plan_id, network} = req.body;
 try{
  const key = process.env.MBC_API_KEY;
  const r = await fetch('https://mbcdata.com/api/data/',{
   method:'POST',
   headers:{'Authorization':`Token ${key.trim()}`,'Content-Type':'application/json'},
   body:JSON.stringify({network:parseInt(network), phone:phone.trim(), data_plan:parseInt(data_plan_id), bypass:false, 'request-id':`Data_${Date.now()}`})
  });
  const t = await r.text(); let j; try{j=JSON.parse(t)}catch{j={raw:t}}
  if(j.status==='success') return res.status(200).json({success:true, message:j.message});
  return res.status(400).json({error:j.message||j.response||t});
 }catch(e){ return res.status(500).json({error:e.message}); }
}
