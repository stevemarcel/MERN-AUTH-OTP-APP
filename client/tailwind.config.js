/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      // => @media (min-width: 640px) { ... }
      sm: "640px",

      // => @media (min-width: 768px) { ... }
      md: "768px",

      // => @media (min-width: 1024px) { ... }
      lg: "1024px",

      // => @media (min-width: 1280px) { ... }
      xl: "1280px",

      // => @media (min-width: 1536px) { ... }
      "2xl": "1536px",
    },
    extend: {},
  },
  plugins: [],
};
