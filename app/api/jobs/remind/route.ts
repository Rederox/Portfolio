import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(req: NextRequest) {
  const { interview, subscription } = await req.json();

  if (!interview) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const dateStr = new Date(`${interview.date}T${interview.time}`).toLocaleString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const typeLabels: Record<string, string> = {
    phone: "Téléphonique",
    video: "Visioconférence",
    onsite: "Présentiel",
    technical: "Technique",
  };
  const typeLabel = typeLabels[interview.type] ?? interview.type;

  const results: { email?: string; push?: string } = {};

  // Email reminder
  if (process.env.SMTP_USER) {
    try {
      await transporter.sendMail({
        from: `"Portfolio Jobs" <${process.env.SMTP_USER}>`,
        to: process.env.SMTP_USER,
        subject: `📅 Entretien — ${interview.title} @ ${interview.company}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0d0d0d;color:#e2e8f0;padding:32px;border-radius:16px">
            <h2 style="color:#fff;margin-top:0">Rappel d'entretien</h2>
            <div style="background:#131313;border:1px solid #1e1e1e;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#fff">${interview.title}</p>
              <p style="margin:0 0 16px;font-size:14px;color:#94a3b8">${interview.company}</p>
              <p style="margin:0 0 8px;font-size:14px;color:#e2e8f0">📅 ${dateStr}</p>
              <p style="margin:0;font-size:14px;color:#e2e8f0">🎙 Type : ${typeLabel}</p>
              ${interview.notes ? `<p style="margin:12px 0 0;font-size:13px;color:#64748b;border-top:1px solid #1e1e1e;padding-top:12px">${interview.notes}</p>` : ""}
            </div>
            <p style="font-size:12px;color:#475569;margin:0">Envoyé depuis ton admin portfolio.</p>
          </div>
        `,
      });
      results.email = "ok";
    } catch (err) {
      console.error("Email error:", err);
      results.email = "error";
    }
  }

  // Push notification
  if (subscription?.endpoint) {
    try {
      await webpush.sendNotification(
        subscription,
        JSON.stringify({
          title: `Entretien — ${interview.company}`,
          body: `${interview.title} · ${dateStr}`,
          url: "/admin/jobs",
        })
      );
      results.push = "ok";
    } catch (err) {
      console.error("Push error:", err);
      results.push = "error";
    }
  }

  return NextResponse.json({ ok: true, results });
}
