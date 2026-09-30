# yarakazem.github.io

Design portfolio, live at **https://yarakazem.github.io**.

Plain HTML/CSS/JS with no build step. Edit a file, commit, push, and GitHub Pages redeploys.

## Structure

```
index.html            Home: hero, work grid, about, contact
styles.css            All styles (light and dark mode)
script.js             Footer year + scroll reveal
work/                 One HTML page per case study
assets/img/           Images for thumbnails and case studies
```

## Adding a case study

1. Copy `work/_template.html` to `work/<project-name>.html` and fill it in.
2. Turn its `<article class="card">` into an `<a class="card" href="work/<project-name>.html">` in the `#work` grid in `index.html`.
3. Put images in `assets/img/` and swap the placeholder `.thumb` gradient for an `<img>`.

## Local preview

```bash
python3 -m http.server 8000
```
