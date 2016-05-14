import {Component, OnInit} from '@angular/core';
import {PlayerComponent} from './player.component';
import {Player} from './player';
import {Word} from './word';
import {VALID_WORDS} from './words';

const ROW_COUNT = 9;
const COLUMN_COUNT = 9;
// const enum DIR { Left, Up, Right, Down }

interface GridCell {
  y: number;
  x: number;
  starter: boolean;
  content: string;
  wordAcross: Word;
  wordDown: Word;
}

@Component({
    selector: 'game-board',
    directives: [PlayerComponent],
    template: `
        <player-component [player]="player"></player-component>
        <section class="board">
            <div *ngFor="let row of gridCells" class="board-row">
                <div *ngFor="let cell of row" (click)="cellClicked(cell)" [ngClass]="getClass(cell)">
                    {{cell.content}}
                </div>
            </div>
        </section>
    `
})
export class BoardComponent implements OnInit { 
    player : Player;
    gridCells : GridCell[][];
    
    constructor() {}
    
    ngOnInit() {
        //make a new player
        this.player = new Player();
        
        //make the grid
        this.gridCells = [];
        
        //TODO. get grid values from the server
        for ( let y = 0; y < ROW_COUNT; ++y){
            this.gridCells[y] = [];
            for ( let x = 0; x < COLUMN_COUNT; ++x){
                this.gridCells[y][x] = { x: x, y: y, starter: false, content: "", wordAcross: null, wordDown: null };
                //temp - we will read the cell values from the server but for now we're just testing our grid, so manuall add 
                if ( x % 3 === 1 && y % 3 === 1 ){
                    //a valid starter cell
                    this.gridCells[y][x].starter = true;
                }
                
                //some default cells to spell the title
                if ( x === 1 && y === 1 ) this.gridCells[y][x].content =  "s"
                else if ( x === 2 && y === 1 ) this.gridCells[y][x].content =  "p"
                else if ( x === 3 && y === 1 ) this.gridCells[y][x].content =  "e"
                else if ( x === 4 && y === 1 ) this.gridCells[y][x].content =  "l"
                else if ( x === 5 && y === 1 ) this.gridCells[y][x].content =  "l"
                else if ( x === 1 && y === 2 ) this.gridCells[y][x].content =  "n"
                else if ( x === 1 && y === 3 ) this.gridCells[y][x].content =  "a"
                else if ( x === 1 && y === 4 ) this.gridCells[y][x].content =  "p"
            }
        }
        
        this.findAllWords();
    }
    
    //in an ideal world, we would cache this and not run it each time there is a change but the pressure of a hackathon is not ideal
    findAllWords() {
        //we need to delete all references to words - a better solution would not have two nested loops back to back
        for ( let y = 0; y < ROW_COUNT; ++y){
            for ( let x = 0; x < COLUMN_COUNT; ++x){
                this.gridCells[y][x].wordAcross = null;
                this.gridCells[y][x].wordDown = null;
            }
        }
           
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
        
        console.log('words found ', words);
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
    
    getClass(cell: GridCell) {
        if ( cell.content ) return "board-cell used";
        if ( cell.starter ) return "board-cell starter";
        return "board-cell";
    }
    
    isFree(x,y):boolean {
        if ( x >= COLUMN_COUNT || y >= ROW_COUNT ) return false;
        
        if ( this.gridCells[y][x].content ) return false;
        
        return true;
    }
    
    
    claimPoints(cell: GridCell, across:number, down:number) {
        if ( !across && !down ) return;
        console.log('claiming word/s');
        
        //TODO. send message to server, disable input until result
        cell.content = this.player.currentLetter;
        
        var score = across + down;
        if ( across && down ) score *- 2;
        
        this.player.score += score;
        this.player.nextTurn();
    }
    
    cellClicked(cell: GridCell) {
        //All game logic is applied below... it's a bit immense. 
        console.log(`cell clicked at x: ${cell.x}, y: ${cell.x}. Content is: ${cell.content}`);
        
        //if player can't play then then move is forbidden
        if ( !this.player.ready ) return;
        console.log('player is ready');
         
        //if cell is used the move is forbidden
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
        console.log('adding new word');
        //TODO. send message to server, disable input until result
        cell.content = this.player.currentLetter;
        this.player.nextTurn();
        
        this.findAllWords();
    }
    
}