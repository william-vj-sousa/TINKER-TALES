import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      utilities: {
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      aspectRatio: {
        '8.5x11': '8.5 / 11',
      },fontFamily: {
        jacques: ['"Jacques Francois"', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
