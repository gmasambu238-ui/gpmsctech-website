// ============================================
// SERVER 001 - GPMSCTECH / @speed_awr360° TECH
// SECURITY 001 - Server Inayojitegemea
// ============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const VERIFICATION_EMAIL = (process.env.VERIFICATION_EMAIL || "").trim().toLowerCase();
const SECOND_EMAIL = (process.env.SECOND_EMAIL || "").trim().toLowerCase();
const EMAIL_USER = (process.env.EMAIL_USER || "").trim();
const EMAIL_PASS = (process.env.EMAIL_PASS || "").trim();

const codes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/api/request-code', async (req, res) => {
  const email = (req.body?.email || "").trim().toLowerCase();

  if (!email || email !== VERIFICATION_EMAIL) {
    return res.json({ ok: false, msg: "Email not recognized / Email haitambuliki" });
  }

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.json({ ok: false, msg: "Server email not configured" });
  }

  const code = makeCode();
  codes[email] = { code, expires: Date.now() + 5 * 60 * 1000 };

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: [VERIFICATION_EMAIL, SECOND_EMAIL].filter(Boolean),
      subject: 'SECURITY 001 - Verification Code',
      text: `SECURITY 001 - GPMSCTECH\n\nYour verification code is: ${code}\nIt expires in 5 minutes.\n\nCode yako ya kuthibitisha ni: ${code}\nInaisha baada ya dakika 5.`
    });
    return res.json({ ok: true, msg: "Code sent / Code imetumwa" });
  } catch (e) {
    console.log("Email error:", e.message);
    return res.json({ ok: false, msg: "Failed to send / Imeshindikana kutuma" });
  }
});

app.post('/api/verify-code', (req, res) => {
  const email = (req.body?.email || "").trim().toLowerCase();
  const code = (req.body?.code || "").trim();
  const saved = codes[email];

  if (!saved || Date.now() > saved.expires || saved.code !== code) {
    return res.json({ ok: false, msg: "If He Fails, He Is Hacker / Akishindwa Ni Hacker" });
  }

  delete codes[email];
  return res.json({ ok: true, msg: "If He Can, He Is Owner / Akiweza Huyo Ndiye Owner" });
});

app.get('/', (req, res) => {
  res.send('SERVER 001 - GPMSCTECH - SECURITY 001 - Inafanya Kazi');
});

app.listen(PORT, () => {
  console.log(`SERVER 001 inafanya kazi kwenye port ${PORT}`);
});
