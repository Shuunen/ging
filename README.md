# GING

[![GitHub license](https://img.shields.io/github/license/shuunen/ging.svg?color=informational)](https://github.com/Shuunen/ging/blob/master/LICENSE)
[![Website up](https://img.shields.io/website/https/shuunen-ging.netlify.app.svg)](https://shuunen-ging.netlify.app)

![logo](public/images/logo.svg)

> GING Is Not Gantt, but kind of :)

## Features

- [x] keyboard navigation
- [x] responsive / mobile friendly
- [x] handle GitHub login (via Auth0) to save app state to a private Gist

## Todo

- [ ] try vue-query
- [ ] limit fonts used in src/plugins/webfont.plugin.ts
- [ ] data from & to url
- [ ] export JSON state to file
- [ ] allow loading that JSON file
- [ ] floating plus button that dynamically add project/step
- [ ] refresh button to clear cache & get latest version
- [ ] edit step in modal
- [ ] add Markdown description to a step
- [ ] add complete status on a step
- [ ] allow complete step on edit mode
- [ ] underline project title with completion percent
- [ ] add arrows to navigate horizontally step by step
- [ ] WHERE IS THE KONAMI CODE ?!?
- [ ] suggest notifications to help the user keep in mind incoming steps
- [ ] add color edit to existing projects
- [ ] add step error only appears in console, show it in the UI
- [ ] step selection not clear
- [ ] step add input has no char limit
- [ ] add benchmarks for common tasks : build, lint, test, etc
- [ ] add back the store action hooks (former "store.$onAction") after the split into *.actions.ts modules
- [ ] try to import only used icons (actually all are imported and it cost 300k of css)

## Thanks

- [Boxy Svg](https://boxy-svg.com) : simple & effective svg editor
- [Github](https://github.com) : for all their great work year after year, pushing OSS forward
- [Netlify](https://netlify.com) : awesome company that offers free CI & hosting for OSS projects
- [Oxc](https://oxc.rs) : a lovely super-fast collection of JavaScript tools written in Rust
- [Repo-checker](https://github.com/Shuunen/repo-checker) : checks the repo config & files, while oxlint covers the /src code ^^
- [Shields.io](https://shields.io) : for the nice badges on top of this readme
- [Shuutils](https://github.com/Shuunen/shuutils) : collection of pure JS utils
- [Svg Omg](https://jakearchibald.github.io/svgomg/) : the great king of svg file size reduction
- [TailwindCss](https://tailwindcss.com) : awesome lib to produce maintainable style
- [V8 coverage](https://github.com/vitest-dev/vitest/tree/main/packages/coverage-v8) : simple & effective code coverage via Vitest
- [Vite](https://github.com/vitejs/vite) : super fast frontend tooling
- [Vitest](https://github.com/vitest-dev/vitest) : super fast vite-native testing framework
- [Vue](https://vuejs.org) : when I need a front framework, this is the one I choose <3
