require('core-js/es6');
require('core-js/es7/reflect');
require('core-js/es7/array');

// Typescript emit helpers polyfill
require('ts-helpers');

require('zone.js/dist/zone');
require('zone.js/dist/long-stack-trace-zone');
require('zone.js/dist/proxy'); // since zone.js 0.6.15
require('zone.js/dist/sync-test');
require('zone.js/dist/jasmine-patch'); // put here since zone.js 0.6.14
require('zone.js/dist/async-test');
require('zone.js/dist/fake-async-test');

// RxJS
require('rxjs/Rx');

require('reflect-metadata');

Error.stackTraceLimit = Infinity;

const testing = require('@angular/core/testing');
const browser = require('@angular/platform-browser-dynamic/testing');
testing.TestBed.initTestEnvironment(
  browser.BrowserDynamicTestingModule,
  browser.platformBrowserDynamicTesting()
);

const testContext = require.context('./spec', true, /\.spec\.ts/);
function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}
const modules = requireAll(testContext);
