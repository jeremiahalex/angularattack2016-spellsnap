import {Component} from '@angular/core';
import {PlayerComponent} from './player.component';
import {Player} from './player';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
interface GridCell {
  y: number;
  x: number;
  starter: boolean;
  content: string;
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
export class BoardComponent { 
    rowCount : number = 9;
    columnCount : number = 9;
    
    player : Player;
    gridCells : GridCell[][];
    
    constructor() {
        
        //make a new player
        this.player = new Player();
        
        //make the grid
        this.gridCells = [];
        
        for ( let y = 0; y < this.rowCount; ++y){
            this.gridCells[y] = [];
            for ( let x = 0; x < this.columnCount; ++x){
                this.gridCells[y][x] = { x: x, y: y, starter: false, content: "" };
                //temp - we will read the cell values from the server but for now we're just testing our grid, so manuall add 
                if ( x % 3 === 1 && y % 3 === 1 ){
                    //a valid starter cell
                    this.gridCells[y][x].starter = true;
                }
                
                //some default cells to spell the title
                if ( x === 1 && y === 1 ) this.gridCells[y][x].content =  "S"
                else if ( x === 2 && y === 1 ) this.gridCells[y][x].content =  "P"
                else if ( x === 3 && y === 1 ) this.gridCells[y][x].content =  "E"
                else if ( x === 4 && y === 1 ) this.gridCells[y][x].content =  "L"
                else if ( x === 5 && y === 1 ) this.gridCells[y][x].content =  "L"
                else if ( x === 1 && y === 2 ) this.gridCells[y][x].content =  "N"
                else if ( x === 1 && y === 3 ) this.gridCells[y][x].content =  "A"
                else if ( x === 1 && y === 4 ) this.gridCells[y][x].content =  "P"
            }
        }
    }
    
    getClass(cell: GridCell) {
        if ( cell.content.length > 0 ) return "board-cell used";
        if ( cell.starter ) return "board-cell starter";
        return "board-cell";
    }
    
    cellClicked(cell: GridCell) {
        console.log(`cell clicked at x: ${cell.x}, y: ${cell.x}. Content is: ${cell.content}`);
        if ( cell.content.length > 0 || !this.player.ready ) return; //used
        
        //1. is it a starter cell then place it
        //2. or does it spell a valid word, place it and calculate score
        //hmm doesn't work. how do you place cells to spell words :-/
        if ( cell.starter ) {
            cell.content = this.player.currentLetter;
            this.player.nextTurn();
            return;
        }
    }
}