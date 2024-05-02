# Run locally

```
bundle
bundle exec jekyll serve --livereload
```

# Deploy on Github pages

1. `bundle lock --add-platform x86_64-linux`
2. See `.github/workflows/github-pages.yml` for the deployment workflow. Update actions versions if necessary.

Run: `rougify style github > syntax.css` if changing anything related to the syntax highlighting.

# Todo

- [ ] Update GA