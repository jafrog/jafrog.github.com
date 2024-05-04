# Run locally

```
bundle
bundle exec jekyll serve --livereload
```

# Deploy on Github pages

See this [blog post](https://mzrn.sh/2023/10/26/how-to-use-tailwind-css-with-jekyll-on-github-pages/) for reference.

1. `bundle lock --add-platform x86_64-linux`
2. See `.github/workflows/github-pages.yml` for the deployment workflow. Update actions versions if necessary.

Run: `rougify style github > syntax.css` if changing anything related to the syntax highlighting.

# Misc

## Design

The theme is insired by [this one](https://jamstackthemes.dev/demo/theme/astro-paper/).

## Integrating a Jupyter notebook in a blog post

1. Convert the notebook to markdown: `jupyter nbconvert --to html notebook.ipynb`
2. Paste the output into the body of the post

# Todo

- [ ] Update GA