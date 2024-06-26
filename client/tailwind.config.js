/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#f5f3f2",
        shark: "#213067",
        sharkLight: {
          100: "#d0d3de",
          200: "#b4b4ca",
          300: "#9090b1",
          400: "#6c6e98",
          500: "#484e7f",
        },
        sharkDark: {
          100: "#1e2956",
          200: "#1b2245",
          300: "#181b34",
          400: "#131525",
          500: "#0c0c16",
        },
      },
    },
  },
  plugins: [],
};
