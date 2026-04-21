import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { job, interviewType } = await req.json();

  const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
  if (!MISTRAL_API_KEY) {
    return NextResponse.json({ error: "Clé API Mistral non configurée" }, { status: 500 });
  }

  const typeLabels: Record<string, string> = {
    phone: "téléphonique (screening RH)",
    video: "visioconférence",
    onsite: "présentiel",
    technical: "technique (test de code / live coding)",
  };

  const prompt = `Tu es un coach de recrutement expert. Génère une préparation complète pour un entretien. Retourne UNIQUEMENT un JSON valide.

POSTE: ${job.title}
ENTREPRISE: ${job.company}
TYPE D'ENTRETIEN: ${typeLabels[interviewType] ?? interviewType}
DESCRIPTION DU POSTE: ${job.description || "Non précisée"}

JSON attendu:
{
  "pitch": "Présentation de 30-45 secondes percutante et adaptée à ce poste (texte complet, prêt à réciter)",
  "questions": [
    "Question fréquente 1",
    "Question fréquente 2",
    "Question fréquente 3",
    "Question fréquente 4",
    "Question fréquente 5",
    "Question fréquente 6",
    "Question fréquente 7",
    "Question fréquente 8"
  ],
  "answers_tips": [
    "Conseil pour répondre à la question 1",
    "Conseil pour répondre à la question 2",
    "Conseil pour répondre à la question 3",
    "Conseil pour répondre à la question 4",
    "Conseil pour répondre à la question 5",
    "Conseil pour répondre à la question 6",
    "Conseil pour répondre à la question 7",
    "Conseil pour répondre à la question 8"
  ],
  "questions_to_ask": [
    "Question pertinente à poser au recruteur 1",
    "Question pertinente à poser au recruteur 2",
    "Question pertinente à poser au recruteur 3",
    "Question pertinente à poser au recruteur 4"
  ],
  "tips": [
    "Conseil pratique spécifique à ce type d'entretien 1",
    "Conseil pratique spécifique à ce type d'entretien 2",
    "Conseil pratique spécifique à ce type d'entretien 3",
    "Conseil pratique spécifique à ce type d'entretien 4"
  ]
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
        temperature: 0.4,
        max_tokens: 1400,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur API Mistral" }, { status: 502 });
    }

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Interview prep error:", err);
    return NextResponse.json({ error: "Erreur lors de la génération" }, { status: 500 });
  }
}
