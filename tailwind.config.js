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
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        accent: ["Inter", "system-ui", "sans-serif"],
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        widest: '0.1em',
      },
      colors: {
        // Modern luxury palette
        background: "#fafafa", // Almost white
        foreground: "#1a1f2c", // Navy text
        primary: "#0f172a", // Deep navy
        secondary: "#f8fafc", // Light gray
        accent: "#334155", // Slate blue
        muted: "#e2e8f0", // Light muted
        border: "#cbd5e1",
        navy: {
          light: "#334155",
          DEFAULT: "#1e293b",
          dark: "#0f172a",
        },
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        md: "0.25rem",
        sm: "0.125rem",
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)',
        'gradient-navy': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'pattern-lines': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'elegant': '0 4px 30px rgba(15, 23, 42, 0.1)',
        'navy': '0 0 15px rgba(30, 41, 59, 0.2)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
