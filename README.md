# Smart GPA Calculator

A simple static web app for calculating GPA from course credits and grades. It is built with plain HTML, CSS, and JavaScript, so it can be published directly with GitHub Pages.

## Features

- Add, edit, and remove courses.
- Calculate total credits, quality points, and current GPA automatically.
- Save entries in the browser with `localStorage`.
- Responsive layout for desktop and mobile.
- No build step or backend required.

## Project Structure

```text
smart-gpa-calculator/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── icons/
    │   └── .gitkeep
    └── images/
        └── .gitkeep
```

## Run Locally

Open `index.html` in your browser.

## Deploy To GitHub Pages

1. Push this project to a GitHub repository.
2. Open the repository settings.
3. Go to **Pages**.
4. Set the source to the main branch and root folder.
5. Save, then wait for GitHub to publish the site.

## Grade Scale

The current grade scale is:

| Grade | Points |
| --- | ---: |
| A | 4.0 |
| A- | 3.7 |
| B+ | 3.3 |
| B | 3.0 |
| B- | 2.7 |
| C+ | 2.3 |
| C | 2.0 |
| C- | 1.7 |
| D | 1.0 |
| F | 0.0 |

You can adjust the grade options in `index.html` if your campus uses a different scale.
