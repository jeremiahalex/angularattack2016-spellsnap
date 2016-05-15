System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TURN_TIME, TRASH_PENALTY_TIME, EXCLAIMATION_CHANCE, ALPHABET, Player;
    return {
        setters:[],
        execute: function() {
            TURN_TIME = 50; //milliseconds
            TRASH_PENALTY_TIME = 50;
            EXCLAIMATION_CHANCE = 0.2;
            ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
            Player = (function () {
                function Player() {
                    this.currentLetter = this.randomLetter();
                    this.nextLetter = this.randomLetter();
                    this.timeTillTurn = 0;
                    this.score = 0;
                    this.ready = true;
                }
                Player.prototype.beignGame = function () {
                    var _this = this;
                    //clear interval if one.
                    clearInterval(this.interval);
                    //start our update loop
                    this.lastUpdateTime = new Date().getTime();
                    this.interval = setInterval(function () {
                        var timeNow = new Date().getTime();
                        var dt = timeNow - _this.lastUpdateTime;
                        if (!_this.ready) {
                            _this.timeTillTurn -= dt;
                            if (_this.timeTillTurn <= 0) {
                                console.log('start turn');
                                _this.ready = true;
                            }
                        }
                        _this.lastUpdateTime = timeNow;
                    }, 500);
                };
                Player.prototype.timeRemaining = function () {
                    return this.timeTillTurn;
                };
                //Could move to the following logic serverside for a more secure game but this is a hack, so no need to worry about cheaters
                Player.prototype.randomLetter = function () {
                    var rand = Math.random();
                    if (rand < EXCLAIMATION_CHANCE)
                        return '!';
                    return ALPHABET.charAt(Math.floor(rand * 26));
                };
                Player.prototype.nextTurn = function () {
                    this.ready = false;
                    this.timeTillTurn += TURN_TIME;
                    this.currentLetter = this.nextLetter,
                        this.nextLetter = this.randomLetter();
                    console.log('next turn in ', this.timeTillTurn);
                };
                Player.prototype.skipTurn = function () {
                    console.log('skip turn');
                    this.timeTillTurn += TRASH_PENALTY_TIME;
                    this.nextTurn();
                };
                return Player;
            }());
            exports_1("Player", Player);
        }
    }
});
//# sourceMappingURL=player.js.map