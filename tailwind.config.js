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
            }
        },
    },
    plugins: []
}