/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        background: "#ffffff",
        foreground: "#333333",
        primary: "#1a1a1a",
        accent: "#2563eb",
        muted: "#f3f4f6",
        border: "#e5e7eb",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        md: "0.25rem",
        sm: "0.125rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
