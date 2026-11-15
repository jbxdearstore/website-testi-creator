// Tugas harian: mengirim beberapa permintaan kecil ke database Supabase supaya
// proyek gratis tidak dijeda karena sepi. Dijalankan otomatis oleh Vercel (lihat vercel.json).
// Letakkan di folder "api" pada repo panel creator (api/jaga.js).

const SUPABASE_URL = 'https://yjxdfqvenbsdmgpcdkwe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lnZelyF_Acg8-F-XNIAtDw_pNX3jeRG';

const PERMINTAAN = [
  'settings?select=owner_id&limit=1',
  'testimonials?select=id&limit=1',
  'settings?select=owner_id&limit=2',
  'testimonials?select=id&limit=2',
  'settings?select=owner_id&limit=3',
  'testimonials?select=id&limit=3'
];

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  // Kalau CRON_SECRET diisi di Vercel, hanya Vercel yang boleh memanggil
  const rahasia = process.env.CRON_SECRET;
  if (rahasia && req.headers.authorization !== 'Bearer ' + rahasia) return res.status(401).json({ ok: false });
  const hasil = [];
  let berhasil = 0;
  for (const p of PERMINTAAN) {
    try {
      const r = await fetch(SUPABASE_URL + '/rest/v1/' + p, { headers: { apikey: SUPABASE_KEY } });
      hasil.push(p.split('?')[0] + ' ' + r.status);
      if (r.ok) berhasil++;
    } catch (e) {
      hasil.push(p.split('?')[0] + ' gagal');
    }
  }
  return res.status(berhasil ? 200 : 502).json({ ok: berhasil > 0, berhasil, dari: PERMINTAAN.length, hasil, waktu: new Date().toISOString() });
};
