#!/usr/bin/env node

const child_process = require("child_process");
const path = require("path");
const ELECTRON_PATH = __dirname + "/node_modules/.bin/electron ";
child_process.exec(path.resolve(ELECTRON_PATH) +" " + __dirname + "/index.js");