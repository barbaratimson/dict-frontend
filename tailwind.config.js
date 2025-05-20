module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
            extend: {
                colors: {
                    // Dark theme colors
                        primary: {
                            50: '#e6f1ff',
                            100: '#cce3ff',
                            200: '#99c7ff',
                            300: '#66abff',
                            400: '#338fff',
                            500: '#0073ff', // Primary blue
                            600: '#005ccc',
                            700: '#004599',
                            800: '#002e66',
                            900: '#001733',
                        },
                        background: {
                            DEFAULT: '#0f172a', // Dark blue-gray
                            secondary: '#1e293b',
                            tertiary: '#334155',
                        },
                        text: {
                            primary: '#f8fafc',
                            secondary: '#e2e8f0',
                            muted: '#94a3b8',
                        },
                        accent: {
                            DEFAULT: '#7dd3fc', // Light blue accent
                            hover: '#38bdf8',
                        },
                        success: '#10b981',
                        warning: '#f59e0b',
                        danger: '#ef4444',
                        divider: '#334155',
                    },
                fontSize: {
                    display: ['3.5rem', { lineHeight: '1.1' }],
                    h1: ['2.5rem', { lineHeight: '1.2' }],
                    h2: ['2rem', { lineHeight: '1.25' }],
                    h3: ['1.75rem', { lineHeight: '1.3' }],
                    h4: ['1.5rem', { lineHeight: '1.35' }],
                    h5: ['1.25rem', { lineHeight: '1.4' }],
                    body: ['1rem', { lineHeight: '1.6' }],
                    small: ['0.875rem', { lineHeight: '1.5' }],
                    tiny: ['0.75rem', { lineHeight: '1.4' }],
                },
            }
    },
    plugins: [],
}