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
    var BoardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            BoardComponent = (function () {
                function BoardComponent() {
                    this.rowCount = 9;
                    this.columnCount = 9;
                    this.alphabet = ' *ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    this.gridCells = [];
                    for (var y = 0; y < this.rowCount; ++y) {
                        this.gridCells[y] = [];
                        for (var x = 0; x < this.columnCount; ++x) {
                            this.gridCells[y][x] = { x: x, y: y, content: 0 };
                            //temp - we will read the cell values from the server but for now we're just testing our grid, so manuall add 
                            if (x % 3 === 1 && y % 3 === 1) {
                                //a possible starter cell
                                this.gridCells[y][x].content = 1;
                            }
                            if (x === 1 && y === 1)
                                this.gridCells[y][x].content = 20; //S
                            else if (x === 2 && y === 1)
                                this.gridCells[y][x].content = 17; //P
                            else if (x === 3 && y === 1)
                                this.gridCells[y][x].content = 16; //E
                            else if (x === 4 && y === 1)
                                this.gridCells[y][x].content = 13; //L
                            else if (x === 5 && y === 1)
                                this.gridCells[y][x].content = 13; //L
                            else if (x === 1 && y === 2)
                                this.gridCells[y][x].content = 15; //N
                            else if (x === 1 && y === 3)
                                this.gridCells[y][x].content = 2; //A
                            else if (x === 1 && y === 4)
                                this.gridCells[y][x].content = 17; //P
                        }
                    }
                }
                BoardComponent.prototype.cellClicked = function (cell) {
                    console.log("cell clicked at x: " + cell.x + ", y: " + cell.x + ". Content is: " + cell.content);
                };
                BoardComponent = __decorate([
                    core_1.Component({
                        selector: 'game-board',
                        template: "\n        <section class=\"board\">\n            <div *ngFor=\"let row of gridCells\" class=\"board-row\">\n                <div *ngFor=\"let cell of row\" (click)=\"cellClicked(cell)\"  class=\"board-cell\">\n                    {{alphabet.charAt(cell.content)}}\n                </div>\n            </div>\n        </section>\n    "
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