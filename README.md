# What is this?

This is a small project i'm working on called PangScript.
It's a minimal implementation of Lua that is adapted for and transpiles to PenguinMod code.
This project is aimed towards use in developing advanced projects that would be too time consuming to create by hand in the PenguinMod editor.

# Build/Usage steps

- Make sure you have a modern or latest java version install and in your PATH and as the default, i'm using java 21.
- In the root directory, install everything with your favorite node package manager, for example `npm i` or `bun i`, then run the the install script with the same thing, for example, `npm run install2` or `bun run install2`
- Run the build script, with the same tool you used to install, for example `npm run build` or `bun run build`.
- After this you can enter the "src" directory and run `node index.js` to build "test.lua".

# Command line arguments for index.js

- `--debug` or `-d`, prints additional debug info for the build, the ast and the generated blocks object that goes in project.json.
- `--infile` or `-i`, you can specify a different path to the input lua file, such as `../test2.lua`, the default path is `test.lua` in the src directory if you don't use this argument.
- `--outfile` or `-o`, you can set a different path to save the project file to, such as `../PangScriptTest.pmp`, the default path is `indexTest.pmp` in the root directory if you don't use this argument.

# Current available syntax

literally just view test.lua in the src directory lol