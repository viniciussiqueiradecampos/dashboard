/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    100: '#FBFFE6',
                    200: '#F5FFB5',
                    300: '#EEFD8C',
                    400: '#E5FD61',
                    500: '#DFFE35',
                    600: '#C4DF2E',
                    700: '#A9C128',
                    800: '#8EA221',
                    900: '#74841B',
                    1000: '#5A6B01',
                },
                neutral: {
                    0: '#FFFFFF',
                    100: '#F9FAFB',
                    200: '#F3F4F6', // Page BG
                    300: '#E5E7EB',
                    400: '#D1D5DB',
                    500: '#9CA3AF',
                    600: '#6B7280',
                    700: '#4B5563',
                    800: '#374151',
                    900: '#1F2937',
                    1000: '#111827',
                    1100: '#080B12', // Dark Elements
                },
                // Additional token groups for completeness based on spreadsheet
                purple: { 100: '#F4ECFE', 1000: '#1C0C31' }, // Truncated for brevity, can add full list if needed
                pink: { 100: '#FDEAF9', 1000: '#2E0926' },
                red: { 100: '#FDE9EB', 1000: '#961421' },
                yellow: { 100: '#FEF9E6', 1000: '#322203' },
                green: { 100: '#E8F9F2', 1000: '#042618' },
                blue: { 100: '#EAF3FD', 1000: '#081B30' },
            },
            fontSize: {
                'heading-xs': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
                'heading-sm': ['24px', { lineHeight: '1.4', fontWeight: '700' }],
                'heading-md': ['28px', { lineHeight: '1.4', fontWeight: '700' }],
                'heading-lg': ['32px', { lineHeight: '1.4', fontWeight: '700' }],
                'heading-xl': ['36px', { lineHeight: '1.4', fontWeight: '700' }],
                'heading-2xl': ['40px', { lineHeight: '1.4', fontWeight: '700' }],

                'paragraph-xs': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
                'paragraph-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
                'paragraph-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
                'paragraph-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
            },
            borderRadius: {
                'none': '0',
                'sm': '2px', // shape/2
                'DEFAULT': '4px', // shape/4
                'md': '6px', // shape/6
                'lg': '8px', // shape/8
                'xl': '12px', // shape/12
                '2xl': '16px', // shape/16
                '3xl': '24px', // shape/24
                '4xl': '32px', // shape/32
                'full': '9999px', // shape/100 (assuming circle)
            },
            screens: {
                'md': '768px',
                'lg': '1280px',
                'xl': '1920px',
            }
        },
    },
    plugins: [],
}
