module.exports = {
  content: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  darkMode: "class",
  // DAISY UI CONFIG
  daisyui: {
    styled: true,
    themes: [
      {
        cupcake:{
          ...require("daisyui/src/colors/themes")["[data-theme=cupcake]"],
          "--btn-text-case": "none", // set default text transform for buttons
        }
      },
      {
        forest:{
          ...require("daisyui/src/colors/themes")["[data-theme=forest]"],
          "--btn-text-case": "none", // set default text transform for buttons
        }
      },
    ],
    // themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    // darkTheme: "luxury",
  },
};
