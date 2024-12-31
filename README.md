

# <img src="./ext/icons/icon.svg" style="width:4rem;" /> Tabs Tray

No more endless scrolling! Tabs Tray lays out all tabs on the screen, clear and organized. Now can fully utilize your big fantastic desktop monitor to manage them, supplement to that poor narrow tab bar or sidebar.

Tabs Tray is inspired by, and also aims to bring back the same experience of tab management on tablet browsers.

Features:






## Install

Coming soon...

## Screenshots

working in progress...

## Build

1. Install [Bun](https://bun.sh/).
2. Install dependencies:
	```bash
	bun install .
	```
3. Build:
	```bash
	# release build (minified)
	bun run build --version x.x.x
	# dev build 
	bun run dev
	```
	Output is located at `./build` directory.

4. [Test extension in firefox](about:debugging#/runtime/this-firefox)


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