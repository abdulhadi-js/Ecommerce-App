import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      fontFamily: {
        // Enforce Roboto globally
        sans: ["var(--font-roboto)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-roboto)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        // --- NEW THEME PALETTE ---
        charcoal_blue: {
          DEFAULT: "#2f4550",
        },
        blue_slate: {
          DEFAULT: "#586f7c",
        },
        light_blue: {
          DEFAULT: "#b8dbd9",
        },
        ghost_white: {
          DEFAULT: "#f4f4f9",
        },
        
        // Semantic Colors
        brand: {
          DEFAULT: "hsl(var(--brand))", // Maps to Charcoal Blue
          foreground: "hsl(var(--brand-foreground))", // Maps to Ghost White
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Maps to Blue Slate
          foreground: "hsl(var(--accent-foreground))",
        },
        sale: {
          DEFAULT: "hsl(var(--sale))", // Maps to Light Blue
          foreground: "hsl(var(--sale-foreground))", // Maps to Charcoal Blue
        },
        surface: {
          DEFAULT: "hsl(var(--surface))", // White or Ghost White
        },
        footer: {
          DEFAULT: "hsl(var(--footer-bg))", // Deep Dark for Footer
        },
        icon: {
          primary: "hsl(var(--icon-primary))",
          muted: "hsl(var(--icon-muted))",
        },
        // Sustainability Specific
        sust: {
          primary: "hsl(var(--sust-primary))", // Deep Forest Green
          secondary: "hsl(var(--sust-secondary))", // Alabaster/Sand
          accent: "hsl(var(--sust-accent))", // Terracotta
        },
      },
      backgroundImage: {
         // Clean Gradients
        "gradient-brand": "linear-gradient(135deg, #2f4550 0%, #1a282f 100%)",
        "gradient-accent": "linear-gradient(135deg, #586f7c 0%, #2f4550 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [typography],
};

export default config;