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
            },
            maxWidth: {
                container: '1400px'
            },
            height: {
                topbar: '60px',
                navbar: '90px'
            },
            backgroundImage: {
                poster: 'linear-gradient(to right, rgb(52 78 65 / 0.95) 32%, rgb(0 0 0 / 0.13) 100%)',
                'image-cover': 'linear-gradient(to bottom, rgb(0 0 0 / 0.04) 0%, rgb(52 78 65 / 0.83) 66%)',
                'banner-cover': 'linear-gradient(to right, rgb(52 78 65 / 1) 0%, rgb(0 0 0 / 0.11) 100%)'
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
}
