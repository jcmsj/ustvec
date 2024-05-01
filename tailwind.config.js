/** @type {import('tailwindcss').Config} */
module.exports = {
    daisyui: {
      themes: [
        "night",
        "emerald",
      ],
    },
    content: [
        "./index.html",
        "./src/**/*.{js,ts,vue}",
        "./formkit.theme.ts",
        "./formkit.config.ts",
    ],
    plugins: [
      require("daisyui"),
    ],
  };
  