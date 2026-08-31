export default async function handler(req,res){
 const key = process.env.MBC_API_KEY;
 const r = await fetch('https://mbcdata.com/api/data/plans/',{headers:{'Authorization':`Token ${key}`}});
 const d = await r.json(); return res.status(200).json(d);
}
