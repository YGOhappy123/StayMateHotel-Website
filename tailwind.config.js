/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#588157',
                secondary: '#A3B18A',
                accent: '#344E41',
                tertiary: '#3A5A40',
                ivory: '#F3ECDC'
            }
        }
    },
    plugins: [import('tailwindcss-animate')]
}
