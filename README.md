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
bun install
```

To build:

```bash
bun run build
```

Output is located at `./build` directory.

## Tech Stack

framework: [react](https://react.dev/)
bundler: [mako](https://makojs.dev/)
package manager: [bun](https://bun.sh/)

## Acknowledgment



## Todo

- [x] Card size: use device screen size
- [x] New Tab floating button
- [x] Option page -> Tray Page Mode Option ( tab, popup)
- [x] Expand Button for popup to switch to a single tab (auto hide on tab mode)
- [ ] New (and default) Tray Page Mode Option: In-page, like a drawer, slide animated from the bottom
- [ ] primary color bordered active tab, for popup and in-page mode
- [ ] Browser native style with emotion-js
- [ ] Drag and Drop to move tabs (sortable-js)
- [ ] Extension Icon
- [ ] Chrome port (thumbnail cannot be supported)
- [ ] Publish
- [ ] [Firefox only] Right click menu with browser tab operations (menus.overrideContext)
- [ ] Filter bar (title and url)