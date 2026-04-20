import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { job, profile } = await req.json();

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if (!MISTRAL_API_KEY) {
    return NextResponse.json({ error: "Clé API Mistral non configurée" }, { status: 500 });
  }

  const experiencesText = (profile?.experiences ?? [])
    .map((e: { role: string; company: string; period: string; description: string[]; technologies: string[] }) =>
      `- ${e.role} @ ${e.company} (${e.period}): ${e.description.join(", ")}. Tech: ${e.technologies.join(", ")}`
    )
    .join("\n");

  const skillsText = (profile?.skills ?? [])
    .map((s: { category: string; items: { name: string }[] }) =>
      `${s.category}: ${s.items.map((i) => i.name).join(", ")}`
    )
    .join("\n");

  const prompt = `Tu es un expert en recrutement. Analyse la compatibilité entre ce profil et cette offre. Retourne UNIQUEMENT un JSON valide.

OFFRE:
Poste: ${job.title}
Entreprise: ${job.company}
Description: ${job.description || "Non précisée"}

PROFIL DU CANDIDAT:
Expériences:
${experiencesText || "Non précisées"}

Compétences:
${skillsText || "Non précisées"}

JSON attendu (score de 0 à 100):
{
  "score": 78,
  "strengths": ["point fort concret 1", "point fort concret 2", "point fort concret 3"],
  "gaps": ["lacune concrète 1", "lacune concrète 2"],
  "recommendation": "Un conseil précis et actionnable pour renforcer cette candidature"
}`;

  try {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur API Mistral" }, { status: 502 });
    }

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);
    result.analyzedAt = new Date().toISOString();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Compat error:", err);
    return NextResponse.json({ error: "Erreur lors de l'analyse" }, { status: 500 });
  }
}
