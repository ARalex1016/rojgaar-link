/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgba(var(--primary))",
        primaryShadow: "rgba(var(--primary-sahdow))",
        main: "rgba(var(--main))",
        accent: "rgba(var(--accent))",
        neutral: "rgba(var(--neutral))",
        text: "rgba(var(--text))",
        textOpposite: "rgba(var(--text-opposite))",
        whilte: "rgba(255, 255, 255)",
        black: "rgba(0, 0, 0)",
        gray: "rgb(99, 99, 99)",
        red: "rgb(220, 20, 60)",
        blue: "rgb(0, 123, 255)",
        green: "rgb(40, 167, 69)",
        orange: "rgb(255, 165, 0)",
      },
      boxShadow: {
        "inner-lg": "inset 0 4px 6px",
      },
      spacing: {
        sideSpacing: "32px",
      },
      screens: {
        mobilesm: "0px",
        mobile: "480px",
      },
    },
  },
  plugins: [],
};
