/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 * Override at the last minute with global.filterSystemConfig (as plunkers do)
 */
(function(global) {

  // map tells the System loader where to look for things
  var map = {
    'app':                        'js/',
    '@angular':                   'js/@angular',
    'common':                     'js/@angular',
    'core':                       'js/@angular',
    'platform-browser':           'js/@angular',
    'platform-browser-dynamic':   'js/@angular',
  };

  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                      { main: 'main.js',  defaultExtension: 'js' },
    'common':                   { main: 'common',  defaultExtension: 'umd.js' },
    'core':                     { main: 'core',  defaultExtension: 'umd.js' },
    'platform-browser':         { main: 'platform-browser',  defaultExtension: 'umd.js' },
    'platform-browser-dynamic': { main: 'platform-browser-dynamic',  defaultExtension: 'umd.js' }
  };

  var config = {
    map: map,
    packages: packages
  };

  System.config(config);

})(this);
