System.register(['@angular/core'], function(exports_1, context_1) {
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
    var core_1;
    var MultiplayerService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MultiplayerService = (function () {
                function MultiplayerService() {
                    var _this = this;
                    this.grid = [];
                    this.playerId = "";
                    //create socket io connection
                    this.socket = io("http://localhost:3000");
                    //this.socket = io("https://spellsnap.herokuapp.com"); 
                    //listen for events
                    this.socket.on("connect", function () {
                        console.log("Connected to Game Server");
                    });
                    this.socket.on("disconnect", function () {
                        console.log("Disconnected from Game Server");
                    });
                    this.socket.on("grid", function (grid) {
                        console.log("Received grid ", grid);
                        _this.grid = grid;
                        if (_this.gridCallback)
                            _this.gridCallback(_this.grid);
                    });
                    this.socket.on("players", function (players) {
                        console.log("Received players ", players);
                        _this.players = players;
                        if (_this.playersCallback)
                            _this.playersCallback(_this.players);
                    });
                    this.socket.on("rank", function (rank) {
                        console.log("Received rank ", rank);
                        _this.rank = rank;
                        if (_this.rankCallback)
                            _this.rankCallback(_this.rank);
                    });
                    this.socket.on("playerId", function (playerId) {
                        console.log("Received playerId ", playerId);
                        _this.playerId = playerId;
                    });
                    this.socket.on("update", function (update) {
                        console.log("Received update ", update);
                        if (_this.updateCallback)
                            _this.updateCallback(update);
                        //TODO. if we don't have a callback we need to handle this differently as the grid will be out of sync
                        //options include asking for the grid again or storing these in an array. A timestamp may help to differentiate
                        //observe problem first before fixing
                    });
                    this.socket.on("letterAccepted", function (pack) {
                        console.log("letterAccepted ", pack);
                        if (_this.letterAcceptedCallback)
                            _this.letterAcceptedCallback(pack);
                    });
                    this.socket.on("letterRejected", function (pack) {
                        console.log("letterRejected ", pack);
                        if (_this.letterRejectedCallback)
                            _this.letterRejectedCallback(pack);
                    });
                    this.socket.on("claimAccepted", function (pack) {
                        console.log("claimAccepted ", pack);
                        if (_this.claimAcceptedCallback)
                            _this.claimAcceptedCallback(pack);
                    });
                    this.socket.on("claimRejected", function (pack) {
                        console.log("claimRejected ", pack);
                        if (_this.claimRejectedCallback)
                            _this.claimRejectedCallback(pack);
                    });
                }
                //we register callbacks for each socket event, we could use observables I suppose but too tired to work that out
                MultiplayerService.prototype.registerCallbacks = function (gridCallback, updateCallback, letterAcceptedCallback, letterRejectedCallback, playersCallback, rankCallback, claimAcceptedCallback, claimRejectedCallback) {
                    this.gridCallback = gridCallback;
                    this.updateCallback = updateCallback;
                    this.letterAcceptedCallback = letterAcceptedCallback;
                    this.letterRejectedCallback = letterRejectedCallback;
                    this.playersCallback = playersCallback;
                    this.rankCallback = rankCallback;
                    this.claimAcceptedCallback = claimAcceptedCallback;
                    this.claimRejectedCallback = claimRejectedCallback;
                    //we may already have the grid, if so return it, so they can begin the game
                    if (this.grid && this.grid.length > 0)
                        this.gridCallback(this.grid);
                };
                MultiplayerService.prototype.addLetter = function (x, y, letter) {
                    var pack = { x: x, y: y, letter: letter };
                    console.log("Attempting to add letter: ", pack);
                    this.socket.emit("addLetter", pack);
                };
                MultiplayerService.prototype.claimWord = function (x, y, cells, score) {
                    var pack = { x: x, y: y, cells: cells, score: score };
                    console.log("Attempting to claim word: ", pack);
                    this.socket.emit("claimWord", pack);
                };
                MultiplayerService.prototype.sendStats = function (score, currentLetter) {
                    var pack = { score: score, currentLetter: currentLetter };
                    console.log("Attempting to send stats: ", pack);
                    this.socket.emit("stats", pack);
                };
                MultiplayerService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], MultiplayerService);
                return MultiplayerService;
            }());
            exports_1("MultiplayerService", MultiplayerService);
        }
    }
});

//# sourceMappingURL=multiplayer.service.js.map
