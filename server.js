// ============================================
// SERVER 001 - GPMSCTECH / @speed_awr360° TECH
// SECURITY 001 - Server Inayojitegemea
// Faili hii iko peke yake kwenye GitHub
// Inafanya kazi na security.html + security-verify.js
// ============================================

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// --------------------------------------------
// 1. MIPANGILIO - Inabadilishwa kwenye Render tu, SIO hapa GitHub
// --------------------------------------------
const PORT = process.env.PORT || 3000;

// Email 2 zinazotambulika - zimefichwa kwa *** - kamili ziko kwenye Render Env
const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL || "g***64";
const SECOND_EMAIL = process.env.SECOND_EMAIL || "g***238";

// Hifadhi ya code - kwenye kumbukumbu ya server
const codes = {};

// --------------------------------------------
// 2. KUTUMA EMAIL - Kupitia Gmail App Password
// --------------------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Weka kwenye Render Env
    pass: process.env.EMAIL_PASS  // Weka kwenye Render Env - App Password, SIO Password ya kawaida
  }
});

// Tengeneza code ya tarakimu 6
function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --------------------------------------------
// 3. API 1 - TUMA CODE / REQUEST CODE
// --------------------------------------------
// security-verify.js inaita: POST /api/request-code
// Kazi: Angalia email, tengeneza code, tuma kwa email 2 kiotomatiki
// --------------------------------------------
app.post('/api/request-code', async (req, res) => {
  const { email } = req.body;

  // Kama email si ya Verification - kataa - HACKER RULE
  if (!email || email.trim() !== VERIFICATION_EMAIL) {
    return res.json({ ok: false, msg: "Email not recognized / Email haitambuliki" });
  }

  const code = makeCode();
  // Code inaisha baada ya dakika 5
  codes[email] = { code, expires: Date.now() + 5 * 60 * 1000 };

  try {
    // Tuma kwa Email 2 kiotomatiki - Verification + Second
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: [VERIFICATION_EMAIL, SECOND_EMAIL],
      subject: 'SECURITY 001 - Verification Code / Code ya Kuthibitisha',
      text: `SECURITY 001 - GPMSCTECH / @speed_awr360° TECH\n\nEnglish: Your verification code is: ${code}\nIt expires in 5 minutes.\n\nKiswahili: Code yako ya kuthibitisha ni: ${code}\nInaisha baada ya dakika 5.\n\nIf you did not request this, ignore it. / Kama hukuiomba, ipuuze.`
    });
    return res.json({ ok: true, msg: "Code sent / Code imetumwa" });
  } catch (e) {
    console.log("Email error:", e.message);
    return res.json({ ok: false, msg: "Failed to send / Imeshindikana kutuma" });
  }
});

// --------------------------------------------
// 4. API 2 - THIBITISHA CODE / VERIFY CODE
// --------------------------------------------
// security-verify.js inaita: POST /api/verify-code
// Kazi: Angalia code, kama sahihi = Owner, kama mbaya = Hacker
// --------------------------------------------
app.post('/api/verify-code', (req, res) => {
  const { email, code } = req.body;
  const saved = codes[email];

  // Hakuna code au imeisha muda au si sahihi
  if (!saved || Date.now() > saved.expires || saved.code !== code) {
    return res.json({ ok: false, msg: "If He Fails, He Is Hacker / Akishindwa Ni Hacker" });
  }

  // Code imetumika - futa mara moja - isitumike mara 2
  delete codes[email];
  return res.json({ ok: true, msg: "If He Can, He Is Owner / Akiweza Huyo Ndiye Owner" });
});

// --------------------------------------------
// 5. KUANGALIA KAMA SERVER INAFANYA KAZI
// --------------------------------------------
app.get('/', (req, res) => {
  res.send('SERVER 001 - GPMSCTECH / @speed_awr360° TECH - SECURITY 001 - Inafanya Kazi');
});

// --------------------------------------------
// 6. ANZISHA SERVER
// --------------------------------------------
app.listen(PORT, () => {
  console.log(`SERVER 001 inafanya kazi kwenye port ${PORT}`);
});
