System.register(['@angular/core', './player.component', './multiplayer.service', './player', './word', './words'], function(exports_1, context_1) {
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
    var core_1, player_component_1, multiplayer_service_1, player_1, word_1, words_1;
    var ROW_COUNT, COLUMN_COUNT, SCORE_PER_LETTER, REMOVE_DELAY_INC, DOUBLE_MATCH_MULTIPLIER, BoardComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (player_component_1_1) {
                player_component_1 = player_component_1_1;
            },
            function (multiplayer_service_1_1) {
                multiplayer_service_1 = multiplayer_service_1_1;
            },
            function (player_1_1) {
                player_1 = player_1_1;
            },
            function (word_1_1) {
                word_1 = word_1_1;
            },
            function (words_1_1) {
                words_1 = words_1_1;
            }],
        execute: function() {
            ROW_COUNT = 9;
            COLUMN_COUNT = 9;
            SCORE_PER_LETTER = 2;
            REMOVE_DELAY_INC = 50; //ms
            DOUBLE_MATCH_MULTIPLIER = 2; //bonus if end two words at once
            BoardComponent = (function () {
                function BoardComponent(_multiplayerService) {
                    this._multiplayerService = _multiplayerService;
                    console.log(_multiplayerService.test());
                    this.loading = true;
                }
                BoardComponent.prototype.ngOnInit = function () {
                    //make a new player
                    this.player = new player_1.Player();
                    //make the grid
                    this.gridCells = [];
                    //TODO. get grid values from the server
                    for (var y = 0; y < ROW_COUNT; ++y) {
                        this.gridCells[y] = [];
                        for (var x = 0; x < COLUMN_COUNT; ++x) {
                            this.gridCells[y][x] = { x: x, y: y, starter: false, content: "", wordAcross: null, wordDown: null, state: 0 /* Empty */ };
                            //temp - we will read the cell values from the server but for now we're just testing our grid, so manuall add 
                            if (x % 3 === 1 && y % 3 === 1) {
                                //a valid starter cell
                                this.gridCells[y][x].starter = true;
                            }
                            //some default cells to spell the title
                            if (x === 1 && y === 1)
                                this.gridCells[y][x].content = "s";
                            else if (x === 2 && y === 1)
                                this.gridCells[y][x].content = "p";
                            else if (x === 3 && y === 1)
                                this.gridCells[y][x].content = "e";
                            else if (x === 4 && y === 1)
                                this.gridCells[y][x].content = "l";
                            else if (x === 5 && y === 1)
                                this.gridCells[y][x].content = "l";
                            else if (x === 1 && y === 2)
                                this.gridCells[y][x].content = "n";
                            else if (x === 1 && y === 3)
                                this.gridCells[y][x].content = "a";
                            else if (x === 1 && y === 4)
                                this.gridCells[y][x].content = "p";
                        }
                    }
                    this.findAllWords();
                };
                BoardComponent.prototype.removeConnectedLetters = function (x, y, delay) {
                    var _this = this;
                    //end if exceeds grid return
                    if (x >= COLUMN_COUNT || y >= ROW_COUNT || x < 0 || y < 0)
                        return;
                    //if the cell is empty return
                    if (!this.gridCells[y][x].content)
                        return;
                    //else set content to zero and try all four neighbours
                    setTimeout(function () {
                        _this.gridCells[y][x].state = 4 /* Removed */;
                    }, delay);
                    this.gridCells[y][x].content = "";
                    this.gridCells[y][x].state = 3 /* Removing */;
                    delay += REMOVE_DELAY_INC;
                    this.removeConnectedLetters(x + 1, y, delay);
                    this.removeConnectedLetters(x - 1, y, delay);
                    this.removeConnectedLetters(x, y + 1, delay);
                    this.removeConnectedLetters(x, y - 1, delay);
                };
                BoardComponent.prototype.cleanUp = function () {
                    console.log("removed");
                    //we need to remove each word from the array but if we encounter an exclaimation we also remove all letters that are connected to it
                    for (var y = 0; y < ROW_COUNT; ++y) {
                        for (var x = 0; x < COLUMN_COUNT; ++x) {
                            this.gridCells[y][x].wordAcross = null;
                            this.gridCells[y][x].wordDown = null;
                            if (this.gridCells[y][x].content === "!") {
                                this.removeConnectedLetters(x, y, 0);
                            }
                        }
                    }
                };
                //in an ideal world, we would cache this and not run it each time there is a change but the pressure of a hackathon is not ideal
                BoardComponent.prototype.findAllWords = function () {
                    //we need to delete all references to words - a better solution would not have two nested loops back to back
                    this.cleanUp();
                    var words = [];
                    //find all words that occur in the grid   
                    for (var y = 0; y < ROW_COUNT; ++y) {
                        for (var x = 0; x < COLUMN_COUNT; ++x) {
                            //if no content then move on
                            if (!this.gridCells[y][x].content)
                                continue;
                            //if not already a word across, then start making a word to the right
                            if (!this.gridCells[y][x].wordAcross) {
                                this.gridCells[y][x].wordAcross = new word_1.Word(x, y, this.gridCells[y][x].content);
                                words.push(this.gridCells[y][x].wordAcross);
                                this.makeWord(this.gridCells[y][x].wordAcross, x + 1, y);
                            }
                            //if not already a word from above, then start making a word downwards
                            if (!this.gridCells[y][x].wordDown) {
                                this.gridCells[y][x].wordDown = new word_1.Word(x, y, this.gridCells[y][x].content, true);
                                words.push(this.gridCells[y][x].wordDown);
                                this.makeWord(this.gridCells[y][x].wordDown, x, y + 1, true);
                            }
                        }
                    }
                    this.loading = false;
                    console.log('words found ', words);
                };
                BoardComponent.prototype.makeWord = function (word, x, y, downwards) {
                    if (downwards === void 0) { downwards = false; }
                    //end if exceeds grid return
                    if (x >= COLUMN_COUNT || y >= ROW_COUNT)
                        return;
                    //if the cell is empty return
                    if (!this.gridCells[y][x].content)
                        return;
                    //ammend word 
                    word.content += this.gridCells[y][x].content;
                    if (downwards) {
                        this.gridCells[y][x].wordDown = word;
                    }
                    else {
                        this.gridCells[y][x].wordAcross = word;
                    }
                    //check if this is a word
                    word.isWord = this.isAWord(word.content);
                    //if the content is a exclaimation, mark as claimed and end search 
                    if (this.gridCells[y][x].content === "!") {
                        word.isClaimed = true;
                        return;
                    }
                    //else continue on to next cell
                    if (downwards) {
                        this.makeWord(word, x, y + 1, true);
                    }
                    else {
                        this.makeWord(word, x + 1, y);
                    }
                };
                BoardComponent.prototype.isAWord = function (word, full) {
                    //TODO. need a better way to do this, that is less s l o w. Also using this function less would help
                    if (full === void 0) { full = false; }
                    //for now we ignore 1 letter words
                    if (word.length < 2)
                        return false;
                    for (var i = 0; i < words_1.VALID_WORDS.length; ++i) {
                        var w = words_1.VALID_WORDS[i];
                        //is the word too long
                        if (!w || w.length < word.length)
                            continue;
                        //does it start correctly or end correctly
                        if (w.substr(0, word.length) !== word && w.substr(-word.length) !== word)
                            continue;
                        //else it matches, if we're looking for a full match and it is then return true
                        if (!full)
                            return true;
                        else if (w.length === word.length) {
                            console.log('fully valid: ', word);
                            return true;
                        }
                    }
                    ;
                    console.log('not valid: ', word);
                    return false;
                };
                BoardComponent.prototype.getClass = function (cell) {
                    if (cell.state === 3 /* Removing */)
                        return "board-cell used";
                    if (cell.content)
                        return "board-cell used";
                    if (cell.starter)
                        return "board-cell starter";
                    return "board-cell";
                };
                BoardComponent.prototype.isFree = function (x, y) {
                    if (x >= COLUMN_COUNT || y >= ROW_COUNT)
                        return false;
                    if (this.gridCells[y][x].content)
                        return false;
                    return true;
                };
                BoardComponent.prototype.addLetter = function (cell, letter) {
                    console.log('adding new letter');
                    this.loading = true;
                    //TODO. send message to server, disable input until result
                    cell.content = this.player.currentLetter;
                    cell.state = 2 /* Used */; //Using
                    this.player.score += SCORE_PER_LETTER;
                    this.player.nextTurn();
                    this.findAllWords();
                };
                BoardComponent.prototype.claimPoints = function (cell, across, down) {
                    if (!across && !down)
                        return;
                    console.log('claiming word/s - points ' + across + " & " + down);
                    this.loading = true;
                    //TODO. send message to server, disable input until result
                    cell.content = this.player.currentLetter;
                    cell.state = 2 /* Used */; //using
                    var score = across + down;
                    if (across && down) {
                        score *= DOUBLE_MATCH_MULTIPLIER;
                        console.log('multiplier applied: ', score);
                    }
                    this.player.score += score;
                    this.player.nextTurn();
                    this.findAllWords();
                };
                BoardComponent.prototype.cellClicked = function (cell) {
                    //All game logic is applied below... it's a bit immense. 
                    console.log("cell clicked at x: " + cell.x + ", y: " + cell.x + ". Content is: " + cell.content);
                    console.log('grid ', this.gridCells);
                    if (this.loading)
                        return;
                    //if player can't play then then move is forbidden
                    if (!this.player.ready)
                        return;
                    console.log('player is ready');
                    //if cell is used then move is forbidden
                    if (cell.content)
                        return;
                    console.log('cell is free');
                    //if it is a exclaimation then we handle it differently as it must end a valid word or two - though rare, both are possible together
                    if (this.player.currentLetter === "!") {
                        console.log('is exclaimation');
                        var claimAcross = 0;
                        var claimDown = 0;
                        if (cell.x > 0 && this.gridCells[cell.y][cell.x - 1].wordAcross) {
                            //attempt to finish a word across
                            if (!this.gridCells[cell.y][cell.x - 1].wordAcross.isClaimed && this.isAWord(this.gridCells[cell.y][cell.x - 1].wordAcross.content, true)) {
                                //then this word can be claimed
                                console.log('claim across');
                                claimAcross = this.gridCells[cell.y][cell.x - 1].wordAcross.points();
                            }
                        }
                        if (cell.y > 0 && this.gridCells[cell.y - 1][cell.x].wordDown) {
                            //attempt to finish a word down
                            if (!this.gridCells[cell.y - 1][cell.x].wordDown.isClaimed && this.isAWord(this.gridCells[cell.y - 1][cell.x].wordDown.content, true)) {
                                //then this word can be claimed
                                console.log('claim down');
                                claimDown = this.gridCells[cell.y - 1][cell.x].wordDown.points();
                            }
                            else {
                                //invalidates the word across as well
                                claimAcross = 0;
                            }
                        }
                        this.claimPoints(cell, claimAcross, claimDown);
                        return;
                    }
                    console.log('exclaimation assessed');
                    //if it is not a starter cell but yet it has no neighbours, then the move is forbidden
                    if (!cell.starter && this.isFree(cell.x + 1, cell.y) && this.isFree(cell.x - 1, cell.y) && this.isFree(cell.x, cell.y + 1) && this.isFree(cell.x, cell.y - 1))
                        return;
                    console.log('neighbourhood is ok ');
                    //TODO. could be made smarter for starter cells, to check that the letter could actually make a word based on its surrounding
                    //if this would end a word and word is claimed or would be made invalid, then move is forbidden
                    if (cell.x > 0 && this.gridCells[cell.y][cell.x - 1].wordAcross && (this.gridCells[cell.y][cell.x - 1].wordAcross.isClaimed || !this.isAWord(this.gridCells[cell.y][cell.x - 1].wordAcross.content + this.player.currentLetter)))
                        return;
                    console.log('ending word across assessed');
                    if (cell.y > 0 && this.gridCells[cell.y - 1][cell.x].wordDown && (this.gridCells[cell.y - 1][cell.x].wordDown.isClaimed || !this.isAWord(this.gridCells[cell.y - 1][cell.x].wordDown.content + this.player.currentLetter)))
                        return;
                    console.log('ending word down assessed');
                    //if this would start a word and word is claimed or would be made invalid, then move is forbidden
                    if ((cell.x < COLUMN_COUNT - 1) && this.gridCells[cell.y][cell.x + 1].wordAcross && (this.gridCells[cell.y][cell.x + 1].wordAcross.isClaimed || !this.isAWord(this.player.currentLetter + this.gridCells[cell.y][cell.x + 1].wordAcross.content)))
                        return;
                    console.log('starting word across assessed');
                    if ((cell.y < ROW_COUNT - 1) && this.gridCells[cell.y + 1][cell.x].wordDown && (this.gridCells[cell.y + 1][cell.x].wordDown.isClaimed || !this.isAWord(this.player.currentLetter + this.gridCells[cell.y + 1][cell.x].wordDown.content)))
                        return;
                    console.log('starting word down assessed');
                    //if this would connect two words and either is claimed or the combination would be made invalid, then move is forbidden
                    if (cell.x > 0 && (cell.x < COLUMN_COUNT - 1)
                        && this.gridCells[cell.y][cell.x - 1].wordAcross && this.gridCells[cell.y][cell.x + 1].wordAcross
                        && (this.gridCells[cell.y][cell.x - 1].wordAcross.isClaimed || this.gridCells[cell.y][cell.x + 1].wordAcross.isClaimed
                            || !this.isAWord(this.gridCells[cell.y][cell.x - 1].wordAcross.content + this.player.currentLetter + this.gridCells[cell.y][cell.x + 1].wordAcross.content)))
                        return;
                    console.log('connecting words across assessed');
                    if (cell.y > 0 && (cell.y < ROW_COUNT - 1)
                        && this.gridCells[cell.y - 1][cell.x].wordDown && this.gridCells[cell.y + 1][cell.x].wordDown
                        && (this.gridCells[cell.y - 1][cell.x].wordDown.isClaimed || this.gridCells[cell.y + 1][cell.x].wordDown.isClaimed
                            || !this.isAWord(this.gridCells[cell.y - 1][cell.x].wordDown.content + this.player.currentLetter + this.gridCells[cell.y + 1][cell.x].wordDown.content)))
                        return;
                    console.log('connecting words downs assessed');
                    // else add content
                    this.addLetter(cell, this.player.currentLetter);
                };
                BoardComponent = __decorate([
                    core_1.Component({
                        selector: 'game-board',
                        directives: [player_component_1.PlayerComponent],
                        template: "\n        <player-component [player]=\"player\"></player-component>\n        <section class=\"board\">\n            <div *ngFor=\"let row of gridCells\" class=\"board-row\">\n                <div *ngFor=\"let cell of row\" (click)=\"cellClicked(cell)\" [ngClass]=\"getClass(cell)\">\n                    {{cell.content}}\n                </div>\n            </div>\n        </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [multiplayer_service_1.MultiplayerService])
                ], BoardComponent);
                return BoardComponent;
            }());
            exports_1("BoardComponent", BoardComponent);
        }
    }
});

//# sourceMappingURL=board.component.js.map
