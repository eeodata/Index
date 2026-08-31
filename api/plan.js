export default async function handler(req,res){
 try{
  const key = process.env.MBC_API_KEY;
  const r = await fetch('https://mbcdata.com/api/data/plans/',{
   headers:{Authorization:`Token ${key.trim()}`}
  });
  const data = await r.json();
  return res.status(200).json(data);
 }catch(e){return res.status(500).json({error:e.message})}
}
