import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-nunito-sans)", "sans-serif"],
      },
      colors: {
        // Custom colors from design
        "bg-main": "#091121",
        "bg-light": "#48117c",
        "bg-block": "#261a3d",
        "bg-card": "#261a3d",
        "bg-card-hover": "#342148",
        "bg-text-block": "#342148",
        "bg-options": "#342148",
        "button": "#d2189a",
        "option-green": "#38af00",
        "option-blue": "#047bf6",
        "accent-purple": "#c487ff",
        "accent-cyan": "#047bf6",
        "accent-pink": "#d2189a",
        "accent-primary": "#c487ff",
        "accent-secondary": "#8a18d2",
        "text-primary": "#ffffff",
        "text-secondary": "#8f8f8f",
        "text-muted": "#8f8f8f",
        "border-main": "#342148",

        // ShadcnUI variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        "gradient-root":
          "linear-gradient(154.29deg, #0a1222 3.27%, #230a33 30.79%, #0b1d35 75.38%, #0a1222 101.95%)",
        "gradient-button":
          "linear-gradient(90deg, #8a18d2 0%, #2c3378 100%)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        "mobile-xs": "375px",
        mobile: "450px",
        "mobile-xl": "576px",
        tablet: "768px",
        laptop: "1024px",
        desktop: "1280px",
        max: "1400px",
      },
      fontSize: {
        "2xs": "10px",
        "3xs": "8px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
