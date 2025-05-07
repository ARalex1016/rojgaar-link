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
        red: "rgba(var(--red))",
        white: "rgba(255, 255, 255)",
        black: "rgba(var(--black))",
        gray: "rgb(99, 99, 99)",
        darkGray: "rgb(30, 30, 30)",
        customBlue: "rgba(var(--customBlue))",
        customGreen: "rgb(40, 167, 69)",
        orange: "rgb(255, 165, 0)",
        facebook: "#1877F2",
        instagram: "#E4405F",
        youtube: "#FF0000",
      },
      boxShadow: {
        "inner-lg": "inset 0 4px 6px",
      },
      spacing: {
        sideSpacing: "var(--sideSpacing)",
        menuHeight: "var(--menuHeight)",
      },
      screens: {
        mobilesm: "0px",
        mobile: "450px",
      },
    },
  },
  plugins: [],
};
