export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cartoon: ['"Comic Neue"', '"Comic Sans MS"', 'cursive'],
    },
    boxShadow: {
        cartoon: "8px 8px 0 #8b0000",
        cartoonSm: "5px 5px 0 #8b0000",
      },
    },
  },
  plugins: [],
}
