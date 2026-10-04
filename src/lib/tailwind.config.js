/**
 * KYPO6 — Tailwind Play-CDN theme (mirror of the inline config in index.html).
 * Loaded by archive pages right after https://cdn.tailwindcss.com.
 * If you change the theme on the homepage, mirror it here.
 */
if (typeof tailwind !== 'undefined') tailwind.config = {
    theme: {
        extend: {
            colors: {
                newsprint: '#f5f2eb',
                'newsprint-dark': '#e9e4d6',
                'newsprint-lead': '#2b2926',
                ink: '#11100f',
                'ink-faded': '#4a4641',
                tabloidRed: '#a81c1c',
                tabloidYellow: '#f3ca3e',
            },
            fontFamily: {
                masthead: ['Cinzel', 'serif'],
                headline: ['Oswald', 'sans-serif'],
                serif: ['Newsreader', 'Georgia', 'serif'],
                mono: ['"Courier Prime"', 'monospace'],
            }
        }
    }
};
