System.register(['@angular/platform-browser-dynamic', './app.component', './multiplayer.service', '@angular/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, app_component_1, multiplayer_service_1, core_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (multiplayer_service_1_1) {
                multiplayer_service_1 = multiplayer_service_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            core_1.enableProdMode();
            platform_browser_dynamic_1.bootstrap(app_component_1.AppComponent, [multiplayer_service_1.MultiplayerService]);
        }
    }
});

//# sourceMappingURL=main.js.map
