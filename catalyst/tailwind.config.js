/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#258cf4',
                'background-light': '#f5f7f8',
                'background-dark': '#101922',
                'glass-border': 'rgba(255, 255, 255, 0.08)',
                'glass-bg': 'rgba(30, 41, 59, 0.4)',
            },
            fontFamily: {
                display: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                neon: '0 0 20px rgba(37, 140, 244, 0.3)',
                'neon-strong': '0 0 30px rgba(6, 182, 212, 0.5)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}