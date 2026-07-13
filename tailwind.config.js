/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "space-gradient":
          "linear-gradient(180deg, #0B3D91 0%, #1E6FD9 45%, #3B82F6 100%)",
      },
    },
  },
  plugins: [],
};
