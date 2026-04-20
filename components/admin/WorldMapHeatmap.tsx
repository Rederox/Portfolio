"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const NUM_TO_ALPHA2: Record<string, string> = {
  "004": "AF", "008": "AL", "012": "DZ", "024": "AO", "032": "AR", "036": "AU",
  "040": "AT", "050": "BD", "056": "BE", "068": "BO", "076": "BR", "100": "BG",
  "104": "MM", "116": "KH", "120": "CM", "124": "CA", "144": "LK", "152": "CL",
  "156": "CN", "170": "CO", "180": "CD", "191": "HR", "192": "CU", "196": "CY",
  "203": "CZ", "208": "DK", "218": "EC", "818": "EG", "231": "ET", "246": "FI",
  "250": "FR", "276": "DE", "288": "GH", "300": "GR", "320": "GT", "332": "HT",
  "340": "HN", "348": "HU", "356": "IN", "360": "ID", "364": "IR", "368": "IQ",
  "372": "IE", "376": "IL", "380": "IT", "388": "JM", "392": "JP", "400": "JO",
  "398": "KZ", "404": "KE", "408": "KP", "410": "KR", "414": "KW", "418": "LA",
  "422": "LB", "434": "LY", "440": "LT", "442": "LU", "458": "MY", "484": "MX",
  "504": "MA", "508": "MZ", "516": "NA", "524": "NP", "528": "NL", "554": "NZ",
  "558": "NI", "566": "NG", "578": "NO", "586": "PK", "591": "PA", "598": "PG",
  "600": "PY", "604": "PE", "608": "PH", "616": "PL", "620": "PT", "630": "PR",
  "634": "QA", "642": "RO", "643": "RU", "682": "SA", "686": "SN", "694": "SL",
  "706": "SO", "710": "ZA", "724": "ES", "729": "SD", "752": "SE", "756": "CH",
  "760": "SY", "158": "TW", "764": "TH", "788": "TN", "792": "TR", "800": "UG",
  "804": "UA", "784": "AE", "826": "GB", "840": "US", "858": "UY", "860": "UZ",
  "862": "VE", "704": "VN", "887": "YE", "894": "ZM", "716": "ZW",
};

interface Props {
  data: Record<string, number>;
  accent?: string;
}

function getColor(count: number, max: number, accent: string): string {
  if (count === 0 || max === 0) return "#181818";
  const t = Math.sqrt(count / max);
  const r = parseInt(accent.slice(1, 3), 16);
  const g = parseInt(accent.slice(3, 5), 16);
  const b = parseInt(accent.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${0.1 + t * 0.8})`;
}

function resolveAccent(fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  return v.startsWith("#") ? v : fallback;
}

export default function WorldMapHeatmap({ data, accent: accentProp }: Props) {
  const max = useMemo(() => Math.max(...Object.values(data), 1), [data]);
  const accent = accentProp ?? resolveAccent("#10b981");

  return (
    <div className="relative w-full select-none rounded-lg">
      {/* Gradient legend — bottom-left, minimal */}
      <div className="absolute bottom-1 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="text-slate-700 text-[0.55rem] font-mono">0</span>
        <div
          className="h-1 w-16 rounded-full opacity-70"
          style={{ background: `linear-gradient(to right, #1e1e1e, ${accent})` }}
        />
        <span className="text-slate-700 text-[0.55rem] font-mono">{max}</span>
      </div>

      <ComposableMap
        projectionConfig={{ scale: 230, center: [10, 0] }}
        style={{ width: "100%", height: "160px", display: "block" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const numId = String(geo.id).padStart(3, "0");
              const alpha2 = NUM_TO_ALPHA2[numId];
              const count = alpha2 ? (data[alpha2] ?? 0) : 0;
              const fill = getColor(count, max, accent);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  data-tooltip-id="worldmap-tip"
                  data-tooltip-content={
                    alpha2
                      ? `${geo.properties.name} · ${count} visite${count !== 1 ? "s" : ""}`
                      : geo.properties.name
                  }
                  style={{
                    default:  { fill, stroke: "#252525", strokeWidth: 0.35, outline: "none" },
                    hover:    { fill: count > 0 ? fill : "#222", stroke: "#383838", strokeWidth: 0.5, outline: "none", cursor: "default" },
                    pressed:  { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <ReactTooltip
        id="worldmap-tip"
        style={{
          backgroundColor: "#161616",
          border: "1px solid #2a2a2a",
          color: "#cbd5e1",
          fontSize: "0.68rem",
          borderRadius: "6px",
          padding: "5px 9px",
          zIndex: 50,
        }}
      />
    </div>
  );
}
