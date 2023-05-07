/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#3B3D5A",
        light: "#f5f5f5",
        primary: "#B63E96", // 240,86,199
        secondary: "#4A193E",
        "secondary-light": "#793367",
      },
      animation: {
        "bounce-slow": "bounce 2s linear infinite",
        "ping-slow": "ping 2s linear infinite",
      },
      maxWidth: {
        "8xl": "1535px",
      },
    },
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      "lg-md": { max: "830px" },

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }

      xs: { max: "479px" },
      // => @media (max-width: 479px) { ... }

      xxs: { max: "350px" },
    },
  },
  plugins: [],
};
