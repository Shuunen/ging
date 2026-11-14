# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- Send a `Content-Security-Policy` header that only runs the scripts of the app, with a nonce stamped on them at build time
- Show the Netlify deploy status badge in the readme
- Link the web app manifest from the page so the app can be installed
- Add a favicon and a theme color to the page

## [0.5.1] - 2026-11-13

### Changed

- Move the Tailwind packages that are only used at build time to the dev dependencies
- Move the todo list from the README to a `TODOS.md` file
- Add a `VERSION` file
- Cache the pnpm store in the CI
- Silence the test output with the dot reporter
