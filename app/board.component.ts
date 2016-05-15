import {Component, OnInit} from '@angular/core';
import {PlayerComponent} from './player.component';
import {MultiplayerService} from './multiplayer.service';
import {Player} from './player';
import {Word} from './word';
import {VALID_WORDS} from './words';

const ROW_COUNT = 36;   //TODO. these should match the server, best to pull them from their
const COLUMN_COUNT = 18;
const SCORE_PER_LETTER = 2;
const REMOVE_DELAY_INC = 50;//ms
const DOUBLE_MATCH_MULTIPLIER = 2; //bonus if end two words at once

const enum ANIMATION_STATE { Empty, Using, Used, Effecting, Removing, Removed }

interface GridCell {
  y: number;
  x: number;
  starter: boolean;
  content: string;
  state: ANIMATION_STATE;
  wordAcross: Word;
  wordDown: Word;
}

@Component({
    selector: 'game-board',
    directives: [PlayerComponent],
    template: `
        <player-component [player]="player"></player-component>
        <div class="other-players-box">
            <!-- TODO. could move this into a child component if time permits -->
            <i class="fa fa-users fa-2x" aria-hidden="true"> </i> 
            <div *ngFor="let p of otherPlayers">
                <div *ngIf="p && p.playerId != _multiplayerService.playerId" class="other-player" >
                    {{p.currentLetter || "?"}}
                </div>
            </div>
        </div>
        <div class="instructions" *ngIf="showInstructions" (click)="showInstructions = false" >
            <div class="instructions-box" >
                <h1>Spell Snap!</h1>
                <h2>How to Play</h2>
                <p>Add Letters to build long words</p>
                <p>Start new words on an <strong>*</strong></p>
                <p>Complete words with an <strong>!</strong></p>
                <p>Compete, Cooperate or Ignore</p>
            </div>
        </div>
        <div *ngIf="loading" class="loading-frame">
            <i class="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i>
        </div>
        <section class="board">
            <div *ngFor="let row of gridCells" class="board-row">
                <div *ngFor="let cell of row" (click)="cellClicked(cell)" [ngClass]="getClass(cell)">
                    {{getContent(cell)}}
                </div>
            </div>
        </section>
    `
})
export class BoardComponent implements OnInit { 
    player : Player;
    gridCells : GridCell[][];
    loading : boolean; //this should prob be bound to the service
    otherPlayers : any[];
    showInstructions : boolean;
    
    constructor(private _multiplayerService: MultiplayerService) {
        this.loading = true;
        this.showInstructions = true;
    }
    
    ngOnInit() {
        //make a new player
        this.player = new Player();
        
        this.otherPlayers = [];
        //get grid values from the server
        this._multiplayerService.registerCallbacks( 
            this.buildGrid.bind(this), 
            this.updateGrid.bind(this), 
            this.letterAccepted.bind(this), 
            this.letterRejected.bind(this),
            this.playersUpdate.bind(this),
            this.rankUpdate.bind(this), 
            this.claimAccepted.bind(this), 
            this.claimRejected.bind(this),
            this.timeUpdated.bind(this)
            );
    }
    
    timeUpdated(timeLeft) {
        this.player.timeLeft = timeLeft;
    }
    buildGrid( grid: any ) {
        //reset the player
        this.player.reset();
        
        //clear the grid
        this.gridCells = [];
        
        for ( let y = 0; y < ROW_COUNT; ++y){
            this.gridCells[y] = [];
            for ( let x = 0; x < COLUMN_COUNT; ++x){
                let c = grid[y][x];
                this.gridCells[y][x] = { x: c.x, y: c.y, starter: c.starter, content: c.content, wordAcross: null, wordDown: null, state: ANIMATION_STATE.Empty };
            }
        }
        this.findAllWords();
        
    }
    
    removeConnectedLetters(x,y, delay) {
        //end if exceeds grid return
        if ( x >= COLUMN_COUNT || y >= ROW_COUNT || x < 0 || y < 0 ) return;
        
        //if the cell is empty return
        if ( !this.gridCells[y][x].content ) return;
        
        //else set content to zero and try all four neighbours
        setTimeout( () => {
            this.gridCells[y][x].state = ANIMATION_STATE.Removed;
        }, delay);
        this.gridCells[y][x].content = ""; 
        this.gridCells[y][x].state = ANIMATION_STATE.Removing;
        
        delay += REMOVE_DELAY_INC;
        this.removeConnectedLetters(x+1,y, delay);
        this.removeConnectedLetters(x-1,y, delay);
        this.removeConnectedLetters(x,y+1, delay);
        this.removeConnectedLetters(x,y-1, delay);
    }
    cleanUp() {
        console.log("removed");
        //we need to remove each word from the array but if we encounter an exclaimation we also remove all letters that are connected to it
        for ( let y = 0; y < ROW_COUNT; ++y){
            for ( let x = 0; x < COLUMN_COUNT; ++x){
                this.gridCells[y][x].wordAcross = null;
                this.gridCells[y][x].wordDown = null;
                if ( this.gridCells[y][x].content === "!") {
                    this.removeConnectedLetters(x,y, 0);
                }
            }
        }
    }
    //in an ideal world, we would cache this and not run it each time there is a change but the pressure of a hackathon is not ideal
    findAllWords() {
        //we need to delete all references to words - a better solution would not have two nested loops back to back
        this.cleanUp();
        
        let words = [];  
        //find all words that occur in the grid   
        for ( let y = 0; y < ROW_COUNT; ++y){
            for ( let x = 0; x < COLUMN_COUNT; ++x){
                //if no content then move on
                if (!this.gridCells[y][x].content) continue;
                
                //if not already a word across, then start making a word to the right
                if ( !this.gridCells[y][x].wordAcross ) {
                    this.gridCells[y][x].wordAcross = new Word(x, y, this.gridCells[y][x].content);
                    words.push(this.gridCells[y][x].wordAcross);
                    this.makeWord(this.gridCells[y][x].wordAcross, x+1, y);
                }
                
                //if not already a word from above, then start making a word downwards
                if ( !this.gridCells[y][x].wordDown ) {
                    this.gridCells[y][x].wordDown = new Word(x, y, this.gridCells[y][x].content, true);
                    words.push(this.gridCells[y][x].wordDown);
                    this.makeWord(this.gridCells[y][x].wordDown, x, y+1, true);
                }
            }
        }
        
        this.loading = false;
        console.log('words found ', words);
        
        this._multiplayerService.sendStats(this.player.score, this.player.currentLetter);
    }
    
    makeWord(word:Word, x:number, y:number, downwards:boolean = false) {
        //end if exceeds grid return
        if ( x >= COLUMN_COUNT || y >= ROW_COUNT ) return;
        
        //if the cell is empty return
        if ( !this.gridCells[y][x].content ) return;
       
        //ammend word 
        word.content += this.gridCells[y][x].content; 
        
        if ( downwards ) {
            this.gridCells[y][x].wordDown = word;
        } else {
            this.gridCells[y][x].wordAcross = word;
        }
        
        //check if this is a word
        word.isWord = this.isAWord(word.content);
        
        //if the content is a exclaimation, mark as claimed and end search 
        if ( this.gridCells[y][x].content === "!" ) {
            word.isClaimed = true;
            return;
        }
        
        //else continue on to next cell
        if ( downwards ) {
            this.makeWord(word, x, y+1, true);
        } else {
            this.makeWord(word, x+1, y);
        }
    }
    
    isAWord(word:string, full:boolean = false):boolean {
        //TODO. need a better way to do this, that is less s l o w. Also using this function less would help
        
        //for now we ignore 1 letter words
        if (word.length < 2) return false;
        
        for ( var i = 0; i < VALID_WORDS.length; ++i ) {
            let w = VALID_WORDS[i];
            //is the word too long
            if (!w || w.length < word.length ) continue;
            
            //does it start correctly or end correctly
            if (w.substr(0, word.length) !== word && w.substr(-word.length) !== word ) continue;
           
            //else it matches, if we're looking for a full match and it is then return true
            if (!full) return true;
            else if (w.length === word.length) {
                console.log('fully valid: ', word);
                return true;
            }
        };
        console.log('not valid: ', word);
        
        return false; 
    }
    
    getContent(cell: GridCell) {
        if ( cell.content ) return cell.content;
        if ( cell.starter ) return "*";
        return "";
    }
    
    getClass(cell: GridCell) {
        if ( cell.state === ANIMATION_STATE.Removing ) return "board-cell used";
        if ( cell.content ) return "board-cell used";
        if ( cell.starter ) return "board-cell starter";
        return "board-cell";
    }
    
    isFree(x,y):boolean {
        if ( x >= COLUMN_COUNT || y >= ROW_COUNT ) return false;
        
        if ( this.gridCells[y][x].content ) return false;
        
        return true;
    }
    
    addLetter(cell: GridCell, letter : string) {
        console.log('adding new letter');
        //send message to server, disable input until result
        this.loading = true;
        cell.state = ANIMATION_STATE.Using;
        this._multiplayerService.addLetter(cell.x, cell.y, this.player.currentLetter);
    }
    letterAccepted(result:any) {
        
        this.gridCells[result.y][result.x].content = result.letter;
        this.gridCells[result.y][result.x].state = ANIMATION_STATE.Used;
        
        this.player.score += SCORE_PER_LETTER;
        
        this.player.nextTurn();
        this.findAllWords();
    }
    letterRejected(result:any) {
        this.gridCells[result.y][result.x].state = ANIMATION_STATE.Empty;
        
        this.findAllWords();
    }
    updateGrid(result:any) {
        this.gridCells[result.y][result.x].content = result.letter;
        //To ensure cells are deleted we change them all to exclaimation marks - a bit of a hack but might actually look ok
        if ( result.cells ) {
            result.cells.forEach( (cell)=> {
                this.gridCells[cell.y][cell.x].content = "!";
            })
        }
        this.findAllWords();
    }
    
    claimPoints(cell: GridCell, across:number, down:number) {
        if ( !across && !down ) return;
        console.log('claiming word/s - points ' + across + " & " + down);
        
        var score = across + down;
        if ( across && down ) {
            score *= DOUBLE_MATCH_MULTIPLIER;
            console.log('multiplier applied: ', score); 
        }
        
        //logic is currently client side so we need to tell the server what cells to remove
        var cells = [];
        this.findEffectedCells(cells, cell.x, cell.y, true);
        
        console.log('cells: ', cells); 
        
        this.loading = true;
        cell.state = ANIMATION_STATE.Using;
        this._multiplayerService.claimWord(cell.x, cell.y, cells, score);
    }
    
    findEffectedCells(cells, x, y, first) {
        console.log('checking: %s %s', x, y); 
        //end if exceeds grid return
        if ( x >= COLUMN_COUNT || y >= ROW_COUNT || x < 0 || y < 0 ) return;
        
        //if the cell is empty return
        if ( !first && ( !this.gridCells[y][x].content || this.gridCells[y][x].state == ANIMATION_STATE.Effecting) ) return;
        //mark it as using to
        this.gridCells[y][x].state = ANIMATION_STATE.Effecting;
        
        //else add to the list
        cells.push({ x: x, y: y});
        this.findEffectedCells(cells, x+1,y, false);
        this.findEffectedCells(cells, x-1,y, false);
        this.findEffectedCells(cells, x,y+1, false);
        this.findEffectedCells(cells, x,y-1, false);
    }
    
    claimAccepted(result:any) {
        console.log("claimed ", result);
        this.gridCells[result.y][result.x].content = "!";
        this.gridCells[result.y][result.x].state = ANIMATION_STATE.Used;
        
        this.player.score += result.score;
        
        this.player.nextTurn();
        this.findAllWords();
    }
    claimRejected(result:any) {
        this.gridCells[result.y][result.x].state = ANIMATION_STATE.Empty;
        this.findAllWords();
    }
    
    playersUpdate(result:any) {
        console.log("players updated: ", result);
        this.otherPlayers = result;
    }
    rankUpdate(result:any) {
        this.player.rank = result.rank;
        console.log("rank updated: ", result);
    }
    
    cellClicked(cell: GridCell) {
        //All game logic is applied below... it's a bit immense. 
        console.log(`cell clicked at x: ${cell.x}, y: ${cell.x}. Content is: ${cell.content}`);
        console.log('grid ', this.gridCells );
        
        if ( this.loading ) return;
        
        //if player can't play then then move is forbidden
        if ( !this.player.ready ) return;
        console.log('player is ready');
         
        //if cell is used then move is forbidden
        if ( cell.content ) return;
        console.log('cell is free');
        
        //if it is a exclaimation then we handle it differently as it must end a valid word or two - though rare, both are possible together
        if ( this.player.currentLetter === "!" ) {
            console.log('is exclaimation');
            let claimAcross = 0;
            let claimDown = 0;
            if ( cell.x > 0 && this.gridCells[cell.y][cell.x-1].wordAcross ) {
                //attempt to finish a word across
                if ( !this.gridCells[cell.y][cell.x-1].wordAcross.isClaimed && this.isAWord(this.gridCells[cell.y][cell.x-1].wordAcross.content, true) ) {
                    //then this word can be claimed
                    console.log('claim across');
                    claimAcross = this.gridCells[cell.y][cell.x-1].wordAcross.points();
                }
            }
            
            if ( cell.y > 0 && this.gridCells[cell.y-1][cell.x].wordDown ) {
                //attempt to finish a word down
                if ( !this.gridCells[cell.y-1][cell.x].wordDown.isClaimed && this.isAWord(this.gridCells[cell.y-1][cell.x].wordDown.content, true) ) {
                    //then this word can be claimed
                    console.log('claim down');
                    claimDown = this.gridCells[cell.y-1][cell.x].wordDown.points();
                } else {
                    //invalidates the word across as well
                    claimAcross = 0;
                }
            }
            
            this.claimPoints( cell, claimAcross, claimDown );
            
            return;
        }
        console.log('exclaimation assessed');
        
        //if it is not a starter cell but yet it has no neighbours, then the move is forbidden
        if ( !cell.starter && this.isFree(cell.x + 1, cell.y) && this.isFree(cell.x - 1, cell.y) && this.isFree(cell.x, cell.y + 1) && this.isFree(cell.x, cell.y - 1) ) return;
        console.log('neighbourhood is ok ');
        //TODO. could be made smarter for starter cells, to check that the letter could actually make a word based on its surrounding
        
        //if this would end a word and word is claimed or would be made invalid, then move is forbidden
        if ( cell.x > 0 && this.gridCells[cell.y][cell.x-1].wordAcross && ( this.gridCells[cell.y][cell.x-1].wordAcross.isClaimed || !this.isAWord(this.gridCells[cell.y][cell.x-1].wordAcross.content + this.player.currentLetter ) ) ) return;
        console.log('ending word across assessed');
        if ( cell.y > 0 && this.gridCells[cell.y-1][cell.x].wordDown && ( this.gridCells[cell.y-1][cell.x].wordDown.isClaimed || !this.isAWord(this.gridCells[cell.y-1][cell.x].wordDown.content + this.player.currentLetter ) ) ) return;
        console.log('ending word down assessed');
        
        //if this would start a word and word is claimed or would be made invalid, then move is forbidden
        if ( (cell.x < COLUMN_COUNT-1) && this.gridCells[cell.y][cell.x+1].wordAcross && ( this.gridCells[cell.y][cell.x+1].wordAcross.isClaimed || !this.isAWord(this.player.currentLetter + this.gridCells[cell.y][cell.x+1].wordAcross.content) ) ) return;
        console.log('starting word across assessed');
        if ( (cell.y < ROW_COUNT-1) && this.gridCells[cell.y+1][cell.x].wordDown && ( this.gridCells[cell.y+1][cell.x].wordDown.isClaimed || !this.isAWord(this.player.currentLetter + this.gridCells[cell.y+1][cell.x].wordDown.content) ) ) return;
        console.log('starting word down assessed');
        
        //if this would connect two words and either is claimed or the combination would be made invalid, then move is forbidden
        if ( cell.x > 0 && (cell.x < COLUMN_COUNT-1) 
            && this.gridCells[cell.y][cell.x-1].wordAcross && this.gridCells[cell.y][cell.x+1].wordAcross
            && ( this.gridCells[cell.y][cell.x-1].wordAcross.isClaimed || this.gridCells[cell.y][cell.x+1].wordAcross.isClaimed 
            || !this.isAWord(this.gridCells[cell.y][cell.x-1].wordAcross.content + this.player.currentLetter + this.gridCells[cell.y][cell.x+1].wordAcross.content ) ) ) return;
        
        console.log('connecting words across assessed');
        
        if ( cell.y > 0 && (cell.y < ROW_COUNT-1) 
            && this.gridCells[cell.y-1][cell.x].wordDown && this.gridCells[cell.y+1][cell.x].wordDown
            && ( this.gridCells[cell.y-1][cell.x].wordDown.isClaimed || this.gridCells[cell.y+1][cell.x].wordDown.isClaimed 
            || !this.isAWord(this.gridCells[cell.y-1][cell.x].wordDown.content + this.player.currentLetter + this.gridCells[cell.y+1][cell.x].wordDown.content ) ) ) return;
        
        console.log('connecting words downs assessed');
        
        // else add content
        this.addLetter(cell, this.player.currentLetter);
    }
    
}