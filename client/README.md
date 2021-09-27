# MMORPG client sample
Browser MMORPG sample for client code. Remember: This is not a real game and I do not intent to finish it, so any contributions will be rejected since I'm using this one just for hobby purposes.

## Requirements
- Node v14 or higher;
- NPM v6 or higher.

## Sprites
Got all sprites for free on [itch.io](https://itch.io/) and adjusted them with [Piskel](https://www.piskelapp.com/). Sprites in use:
- [Red hood](https://legnops.itch.io/red-hood-character);
- [Ghoul](https://elthen.itch.io/2d-pixel-art-ghoul-sprites);
- [Tree](https://graphscriptdev.itch.io/tree-pixel-art).

## Running
- `npm run build` to build ts files into js files for the browser. Run `npm run build:watch` if you want to change source files;
- `npm run dev` to start browser and watch for source file changes.

## Known issues
- When a new player joins the game will show a new "red hood" on the screen, but with static animation even when they are moving;
- Player.ts with high cyclomatic complexity in `update()` code;
- No further animations for the enemy. It has only one standing animation and just disappear when they die;
- Exp bar and leveling are showing only in the client, refresh and it will be reseted;
- Lots of `TODO` with code design improvements or features that were not made.