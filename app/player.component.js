System.register(['@angular/core', './player'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, player_1;
    var PlayerComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            }],
        execute: function() {
            PlayerComponent = (function () {
                function PlayerComponent() {
                }
                PlayerComponent.prototype.ngOnInit = function () {
                    this.player.beignGame();
                };
                PlayerComponent.prototype.timeTillNextTurn = function () {
                    return Math.round(this.player.timeRemaining() / 1000);
                };
                PlayerComponent.prototype.playerRaking = function () {
                    return "1 / 1"; //TODO. get this from a service from the server
                };
                PlayerComponent.prototype.trashLetter = function () {
                    console.log('trash clicked');
                    this.player.skipTurn();
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', player_1.Player)
                ], PlayerComponent.prototype, "player", void 0);
                PlayerComponent = __decorate([
                    core_1.Component({
                        selector: 'player-component',
                        template: "\n        <section class=\"player-box\">\n            <div class=\"player-actions\">\n                <div class=\"current-letter\">\n                    {{player.currentLetter}}\n                    <div *ngIf=\"!player.ready\" class=\"time-till\">\n                        {{timeTillNextTurn()}}\n                    </div>\n                </div>\n                <button (click)=\"trashLetter()\" [disabled]=\"!player.ready\" >skip</button>\n                <div class=\"next-letter\">{{player.nextLetter}}</div>\n            </div>\n            <div class=\"player-stats\">\n                <h1 class=\"player-score\">{{player.score}}<small> PTS</small></h1>\n                <p class=\"player-rank\">RANK: {{playerRaking()}}</p>\n            </div>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], PlayerComponent);
                return PlayerComponent;
            }());
            exports_1("PlayerComponent", PlayerComponent);
        }
    }
});
//# sourceMappingURL=player.component.js.map