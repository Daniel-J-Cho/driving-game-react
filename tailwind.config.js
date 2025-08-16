/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,tx,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'kode-mono': ['Kode Mono', 'monospace'],
                'sixtyfour': ['Sixtyfour Convergence', 'serif'],
            },
        },
    },
    plugins: [],
}
