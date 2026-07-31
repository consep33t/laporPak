/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clayBg: "#e0e5ec",       // Perfect Soft UI base color (Required for true 3D extrusion)
        clayPrimary: "#e0e5ec",  // MUST be the exact same as background
        clayText: "#4d5b6b",     // Soft UI text color for perfect contrast
        clayBlue: "#5788ff",     // Accent Blue
        clayRed: "#ff7473",      // Accent Red
        clayYellow: "#ffc952",   // Accent Yellow
        clayGreen: "#47b39c",    // Accent Green
        clayPurple: "#b08bff"    // Accent Purple
      },
      boxShadow: {
        // Polished White Shadows: using pure #FFFFFF for the outer highlight and stronger inset
        clay: "9px 9px 16px rgba(163, 177, 198, 0.6), -9px -9px 16px #FFFFFF, inset 4px 4px 8px rgba(255, 255, 255, 1), inset -3px -3px 6px rgba(163, 177, 198, 0.4)",
        "clay-sm": "5px 5px 10px rgba(163, 177, 198, 0.6), -5px -5px 10px #FFFFFF, inset 2px 2px 5px rgba(255, 255, 255, 1), inset -2px -2px 5px rgba(163, 177, 198, 0.4)",
        "clay-active": "inset 6px 6px 12px rgba(163, 177, 198, 0.6), inset -6px -6px 12px #FFFFFF",
        "clay-btn": "7px 7px 14px rgba(163, 177, 198, 0.6), -7px -7px 14px #FFFFFF, inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -2px -2px 5px rgba(0, 0, 0, 0.1)",
        "clay-btn-active": "inset 4px 4px 8px rgba(0, 0, 0, 0.25), inset -4px -4px 8px rgba(255, 255, 255, 0.6)",
      }
    },
  },
  plugins: [],
};
