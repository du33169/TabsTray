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
- [ ] i18n
- [ ] Customize Action bar position
- [ ] Multi-Drag Mode (Selection Mode)
- [ ] Filter bar (title and url)

## Known Issues

- [ ] Drag-Drop Function conflict with other tab management extensions, for example, Tree Style Tab
- [ ] tab icon color not updating on theme update (In-page popup)
- [ ] In-Page mode will add "dark"/"light" class  to the global html element