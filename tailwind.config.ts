import type { Config } from "tailwindcss";

// Identidade visual BJuris — premium, jurídico, minimalista.
// Paleta obrigatória: preto, dourado, branco (seção 4 do briefing).
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        noir: {
          DEFAULT: "#0B0B0C", // preto principal, fundo da aplicação
          soft: "#161618",    // superfícies elevadas (cards, sidebar)
          line: "#26262A"     // divisórias, bordas
        },
        gold: {
          DEFAULT: "#B8912F", // dourado principal — usado como destaque, não como base
          light: "#D8B65C",
          dim: "#8A6E27"
        },
        paper: {
          DEFAULT: "#F7F6F2", // branco quente, não papel puro
          muted: "#C9C8C2"
        }
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        tightish: "-0.01em"
      }
    }
  },
  plugins: []
} satisfies Config;
