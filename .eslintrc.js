module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "unused-imports", "tailwindcss"],
  rules: {
    "@typescript-eslint/no-var-requires": "warn",
    "no-console": "warn",
    semi: "error",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "warn",
    "max-len": ["warn", { code: 120, ignoreComments: true }],
    "unused-imports/no-unused-imports": "error",
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
        imports: "only-multiline",
        exports: "only-multiline",
        functions: "only-multiline",
      },
    ],
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/enforces-negative-arbitrary-values": "warn",
    "tailwindcss/enforces-shorthand": "warn",
    "tailwindcss/migration-from-tailwind-2": "warn",
    "tailwindcss/no-arbitrary-value": "off",
    "tailwindcss/no-custom-classname": "off",
    "tailwindcss/no-contradicting-classname": "error",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": ["off"],
  },
  ignorePatterns: ["**/*.js"],
  settings: {
    tailwindcss: {
      // These are the default values but feel free to customize
      callees: ["classNames", "clsx", "ctl"],
      config: "tailwind.config.js",
      cssFiles: [
        "**/*.css",
        "!**/node_modules",
        "!**/.*",
        "!**/dist",
        "!**/build",
      ],
      cssFilesRefreshRate: 5000,
      groupByResponsive: true,
      // "groups": defaultGroups, // imported from groups.js
      officialSorting: true,
      prependCustom: false,
      removeDuplicates: true,
      whitelist: [],
    },
  },
};
