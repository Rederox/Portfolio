import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, message } = await req.json();

  if (!firstName || !lastName || !email || !message) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `Contact portfolio — ${firstName} ${lastName}`,
      text: `De : ${firstName} ${lastName}\nEmail : ${email}\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <h2 style="margin-bottom:4px">Nouveau message de ${firstName} ${lastName}</h2>
          <p style="color:#888;margin-top:0">${email}</p>
          <hr/>
          <p style="white-space:pre-wrap">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur envoi email:", err);
    return NextResponse.json({ error: "Échec de l'envoi." }, { status: 500 });
  }
}
