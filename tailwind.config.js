module.exports = {
  content: [
    "./pages/**/*.tsx",
    "./components/**/*.tsx",
    "./layouts/**/*.tsx",
    "./utils/**/*.tsx",
    "./utils/helpers/*.ts",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
      rotate: {
        360: "360deg",
      },
      // animation:{
      //   'bounce-fast' : "bounce 900ms infinite",
      //   'bounce-slow' : "bounce 1100ms infinite",
      // }
    },
  },
  plugins: [require("@tailwindcss/typography"),require("@tailwindcss/line-clamp"), require("daisyui")],
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
          neutral: "#d7cccc",
          "base-content": "#d7cccc",
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
