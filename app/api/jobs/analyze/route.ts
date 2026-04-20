import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, title, company } = await req.json();

  if (!description && !title) {
    return NextResponse.json({ error: "Description manquante" }, { status: 400 });
  }

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if (!MISTRAL_API_KEY) {
    return NextResponse.json({ error: "Clé API Mistral non configurée" }, { status: 500 });
  }

  const prompt = `Tu es un expert en recrutement et développement de carrière. Analyse cette offre d'emploi et retourne UNIQUEMENT un objet JSON valide, sans aucun texte autour.

Poste: ${title || "Non précisé"}
Entreprise: ${company || "Non précisée"}
Description:
${description || "Aucune description fournie"}

Structure JSON attendue (respecte exactement ces clés):
{
  "summary": "Résumé du poste en 2-3 phrases claires et concises",
  "skills_required": ["compétence1", "compétence2", "compétence3"],
  "skills_nice": ["compétence bonus 1", "compétence bonus 2"],
  "roadmap": [
    { "step": 1, "title": "Titre court", "description": "Description de l'action à mener" },
    { "step": 2, "title": "Titre court", "description": "Description de l'action à mener" }
  ],
  "tips": ["Conseil concret pour décrocher ce poste", "Conseil 2"],
  "salary_estimate": "Fourchette salariale estimée en EUR/an ou null si impossible à estimer"
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
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Mistral error:", err);
      return NextResponse.json({ error: "Erreur API Mistral" }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "Réponse vide de Mistral" }, { status: 502 });
    }

    const analysis = JSON.parse(content);
    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: "Erreur lors de l'analyse" }, { status: 500 });
  }
}
