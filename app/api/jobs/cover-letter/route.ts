import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { type, job, profile, relanceContext } = await req.json();

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if (!MISTRAL_API_KEY) {
    return NextResponse.json({ error: "Clé API Mistral non configurée" }, { status: 500 });
  }

  let prompt: string;

  if (type === "relance") {
    const days = relanceContext?.days ?? 7;
    prompt = `Rédige un email de relance professionnel et concis en français pour une candidature au poste de "${job.title}" chez "${job.company}", envoyée il y a ${days} jours.

L'email doit :
- Être court (3-4 phrases max)
- Rappeler la candidature initiale
- Exprimer l'intérêt renouvelé pour le poste
- Se terminer par une formule de politesse adaptée
- Ne PAS inclure d'objet (juste le corps du mail)

Commence directement par "Madame, Monsieur,".`;
  } else {
    const experiencesText = (profile?.experiences ?? [])
      .map((e: { role: string; company: string; period: string; description: string[]; technologies: string[] }) =>
        `- ${e.role} @ ${e.company} (${e.period})\n  ${e.description.join(" ")}\n  Technologies: ${e.technologies.join(", ")}`
      )
      .join("\n\n");

    const skillsText = (profile?.skills ?? [])
      .map((s: { category: string; items: { name: string }[] }) =>
        `${s.category}: ${s.items.map((i) => i.name).join(", ")}`
      )
      .join(" | ");

    prompt = `Tu es expert en rédaction professionnelle. Rédige une lettre de motivation en français, percutante et personnalisée.

OFFRE VISÉE:
Poste: ${job.title}
Entreprise: ${job.company}
${job.location ? `Localisation: ${job.location}` : ""}
Description: ${job.description || "Non précisée"}

PROFIL DU CANDIDAT:
${experiencesText || "Expériences non précisées"}

Compétences: ${skillsText || "Non précisées"}

CONSIGNES:
- 3 à 4 paragraphes bien structurés
- Ton professionnel mais dynamique
- Personnalisée par rapport à l'entreprise et au poste
- Commence par "Madame, Monsieur,"
- Termine par "Dans l'attente de votre retour, je reste disponible pour un entretien.\n\nCordialement,\n[Prénom Nom]"
- Ne mets PAS d'objet ni d'en-tête
- Longueur : 250-350 mots`;
  }

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
        temperature: 0.6,
        max_tokens: 1200,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur API Mistral" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    return NextResponse.json({ content });
  } catch (err) {
    console.error("Cover letter error:", err);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
