module.exports = {
    content: [
        './_drafts/**/*.html',
        './_includes/**/*.html',
        './_layouts/**/*.html',
        './_posts/*.md',
        './*.md',
        './*.html',
    ],
    theme: {
        extend: {
            fontFamily: {
                plex: ["IBM Plex Mono", "monospace"],
            },
            colors: {
                "light-green": "rgb(251, 254, 251)"
            }
        },
    },
    plugins: []
}