/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "var(--dark)",
        papaya: {
          500: "var(--papaya-500)",
          600: "var(--papaya-600)",
        },
        "text-heading": "var(--text-default-heading)",
        "text-body": "var(--text-default-body)",
        "surface-page": "var(--surface-page)",
        "surface-default": "var(--surface-default)",
        "border-default": "var(--border-default-secondary)",
        success: "var(--text-success-default)",
        error: "var(--text-error-default)",
      },
      fontFamily: {
        sans: ["PP Neue Montreal", "sans-serif"],
      },
      spacing: {
        s100: "var(--s-100)",
        s200: "var(--s-200)",
        s300: "var(--s-300)",
        s400: "var(--s-400)",
        s500: "var(--s-500)",
        s600: "var(--s-600)",
        s800: "var(--s-800)",
      },
      borderRadius: {
        br100: "var(--br-100)",
        br200: "var(--br-200)",
      },
    },
  },
  plugins: [],
};
