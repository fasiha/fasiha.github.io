"use strict";
var fromProcess = require('bluebird-promise-process').fromProcess;

module.exports = function spawnPromise(spawned, stdin) {
  if (stdin && stdin.length) {
    spawned.stdin.write(stdin);
    spawned.stdin.end();
  }
  return fromProcess(spawned);
}
