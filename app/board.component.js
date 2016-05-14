System.register(['@angular/core', './player.component', './player'], function(exports_1, context_1) {
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
    var core_1, player_component_1, player_1;
    var ALPHABET, BoardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (player_component_1_1) {
                player_component_1 = player_component_1_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            }],
        execute: function() {
            ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            BoardComponent = (function () {
                function BoardComponent() {
                    this.rowCount = 9;
                    this.columnCount = 9;
                    //make a new player
                    this.player = new player_1.Player();
                    //make the grid
                    this.gridCells = [];
                    for (var y = 0; y < this.rowCount; ++y) {
                        this.gridCells[y] = [];
                        for (var x = 0; x < this.columnCount; ++x) {
                            this.gridCells[y][x] = { x: x, y: y, starter: false, content: "" };
                            //temp - we will read the cell values from the server but for now we're just testing our grid, so manuall add 
                            if (x % 3 === 1 && y % 3 === 1) {
                                //a valid starter cell
                                this.gridCells[y][x].starter = true;
                            }
                            //some default cells to spell the title
                            if (x === 1 && y === 1)
                                this.gridCells[y][x].content = "S";
                            else if (x === 2 && y === 1)
                                this.gridCells[y][x].content = "P";
                            else if (x === 3 && y === 1)
                                this.gridCells[y][x].content = "E";
                            else if (x === 4 && y === 1)
                                this.gridCells[y][x].content = "L";
                            else if (x === 5 && y === 1)
                                this.gridCells[y][x].content = "L";
                            else if (x === 1 && y === 2)
                                this.gridCells[y][x].content = "N";
                            else if (x === 1 && y === 3)
                                this.gridCells[y][x].content = "A";
                            else if (x === 1 && y === 4)
                                this.gridCells[y][x].content = "P";
                        }
                    }
                }
                BoardComponent.prototype.getClass = function (cell) {
                    if (cell.content.length > 0)
                        return "board-cell used";
                    if (cell.starter)
                        return "board-cell starter";
                    return "board-cell";
                };
                BoardComponent.prototype.cellClicked = function (cell) {
                    console.log("cell clicked at x: " + cell.x + ", y: " + cell.x + ". Content is: " + cell.content);
                    if (cell.content.length > 0 || !this.player.ready)
                        return; //used
                    //1. is it a starter cell then place it
                    //2. or does it spell a valid word, place it and calculate score
                    //hmm doesn't work. how do you place cells to spell words :-/
                    if (cell.starter) {
                        cell.content = this.player.currentLetter;
                        this.player.nextTurn();
                        return;
                    }
                };
                BoardComponent = __decorate([
                    core_1.Component({
                        selector: 'game-board',
                        directives: [player_component_1.PlayerComponent],
                        template: "\n        <player-component [player]=\"player\"></player-component>\n        <section class=\"board\">\n            <div *ngFor=\"let row of gridCells\" class=\"board-row\">\n                <div *ngFor=\"let cell of row\" (click)=\"cellClicked(cell)\" [ngClass]=\"getClass(cell)\">\n                    {{cell.content}}\n                </div>\n            </div>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], BoardComponent);
                return BoardComponent;
            }());
            exports_1("BoardComponent", BoardComponent);
        }
    }
});
//# sourceMappingURL=board.component.js.map