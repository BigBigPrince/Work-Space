// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // 添加 primary 颜色，使用蓝色500作为默认值
      },
    },
  },
  plugins: [],
}
