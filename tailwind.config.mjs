/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand_blue: "#003399",
        brand_green: "#739400",
      },
      fontSize: {
        's-14': '14px',
        'xs-10': '10px',
        'm-20': '20px',
        'l-24': '24px',
        'xl-32': '32px',
      },
    },
  },
  plugins: [],
};