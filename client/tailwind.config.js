/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Notion-style neutral palette
                notion: {
                    bg: '#191919',
                    'bg-secondary': '#202020',
                    'bg-tertiary': '#252525',
                    'bg-hover': '#2f2f2f',
                    border: '#333333',
                    'border-light': '#404040',
                    text: '#ebebeb',
                    'text-secondary': '#9b9b9b',
                    'text-tertiary': '#6b6b6b',
                    accent: '#1E3A8A', // BMSIT Blue
                    'accent-hover': '#172554', // Darker Blue
                    success: '#0f766e',
                    warning: '#d97706',
                    error: '#dc2626',
                    bmsit: {
                        blue: '#1E3A8A', // Official Deep Blue
                        gold: '#EED07A', // Official Golden Sand
                        red: '#991B1B', // Optional Academic Red
                    },
                },
                // Keep dark for backward compatibility
                dark: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#191919',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
