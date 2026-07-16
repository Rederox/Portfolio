import { ImageResponse } from "next/og";
import { personal, stats } from "@/data/portfolio";

export const runtime = "edge";
export const alt = `${personal.name} — ${personal.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GOLD = "#C9A96E";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 80% 0%, rgba(201,169,110,0.14) 0%, transparent 55%), radial-gradient(circle at 0% 100%, rgba(201,169,110,0.07) 0%, transparent 50%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header : disponibilité + domaine */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: `1px solid ${GOLD}55`,
              backgroundColor: `${GOLD}14`,
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 22,
              color: GOLD,
              letterSpacing: 2,
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: 999, backgroundColor: GOLD, display: "flex" }} />
            DISPONIBLE
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#8a8a8a", letterSpacing: 3 }}>
            theivathan.fr
          </div>
        </div>

        {/* Nom + rôle */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1.02 }}>
            {personal.firstName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              letterSpacing: -3,
              lineHeight: 1.02,
              color: GOLD,
            }}
          >
            {personal.lastName}.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 34, color: "#d6d6d6" }}>
            {personal.role}
          </div>
          <div style={{ display: "flex", marginTop: 14, fontSize: 24, color: "#8a8a8a" }}>
            React · Next.js · TypeScript · Node.js · Docker · Mistral AI
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 56, alignItems: "flex-end" }}>
          {stats.map((s) => (
            <div key={s.value} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: GOLD }}>{s.value}</div>
              <div style={{ display: "flex", fontSize: 21, color: "#9a9a9a", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
