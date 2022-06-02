module.exports = {
  content: ["./pages/**/*.tsx", "./components/**/*.tsx","./utils/**/*.tsx"],
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
        cupcake: {
          ...require("daisyui/src/colors/themes")["[data-theme=cupcake]"],
          "--btn-text-case": "none", // set default text transform for buttons
        },
      },
      {
        forest: {
          ...require("daisyui/src/colors/themes")["[data-theme=forest]"],
          "--btn-text-case": "none", // set default text transform for buttons
          primary: "#312e81",
        },
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
