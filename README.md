# Tabs Tray

No more endless scrolling! Tabs Tray lays out all tabs on the screen, clear and organized. Now can fully utilize your big fantastic desktop monitor to manage them, supplement to that poor narrow tab bar or sidebar.

Tabs Tray is inspired by, and also aims to bring back the same experience of tab management on tablet browsers.


## Install

working in progress...

## Screenshots

working in progress...

## Build

To install dependencies:

```bash
bun install .
```

To build:

```bash
bun run build
```

Output is located at `./build` directory.

## Tech Stack

framework: [react](https://react.dev/)
UI: [Chakra UI](https://www.chakra-ui.com/)
package manager & bundler: [bun](https://bun.sh/)


## Acknowledgment



## Todo

- [ ] [Firefox only] Right click menu with browser tab operations (menus.overrideContext)
- [ ] Extension Icon
- [ ] Publish
- [ ] Multi-Drag Mode (Selection Mode)
- [ ] Filter bar (title and url)

## Know Bugs

- [ ] switching to pinned tab does not update focus border (popup mode)
- [ ] sometimes title will overflow card header
- [ ] Drag-Drop Function conflict with other tab management extensions, for example, Tree Style Tab
- [ ] thumbnail and card icon color not updating on theme update
- [ ] Drag-Drop not effective on chrome-based browsers
- [ ] Dynamic Icon not supported on chrome-based browsers