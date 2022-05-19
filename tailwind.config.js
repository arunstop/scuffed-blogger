module.exports = {
  content: ["./pages/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      // fontFamily: {
      //   poppins: ["Poppins", "sans-serif"],
      // },
    },
  },
  plugins: [require("daisyui")],
  darkMode: "class",
  // DAISY UI CONFIG
  daisyui: {
    styled: true,
    themes: ["emerald", "night"],
    // themes: true,
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    // darkTheme: "luxury",
  },
};
