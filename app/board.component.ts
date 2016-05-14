import {Component} from '@angular/core';

@Component({
    selector: 'game-board',
    template: `
        <section class="board">
            <div *ngFor="let row of gridCells" class="board-row">
                <div *ngFor="let cell of row" (click)="cellClicked(cell)"  class="board-cell">
                    {{alphabet.charAt(cell)}}
                </div>
            </div>
        </section>
    `
})
export class BoardComponent { 
    rowCount : number = 9;
    columnCount : number = 9;
    
    gridCells : number[][];
    
    alphabet : string = ' *ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    constructor() {
        this.gridCells = [];
        
        for ( let y = 0; y < this.rowCount; ++y){
            this.gridCells[y] = [];
            for ( let x = 0; x < this.columnCount; ++x){
                this.gridCells[y][x] = 0;
                //temp - we will read the cell values from the server but for now we're just testing our grid, so manuall add 
                if ( x % 3 === 1 && y % 3 === 1 ){
                    //a possible starter cell
                    this.gridCells[y][x] = 1;
                }
                
                if ( x === 1 && y === 1 ) this.gridCells[y][x] = 20; //S
                else if ( x === 2 && y === 1 ) this.gridCells[y][x] = 17; //P
                else if ( x === 3 && y === 1 ) this.gridCells[y][x] = 16; //E
                else if ( x === 4 && y === 1 ) this.gridCells[y][x] = 13; //L
                else if ( x === 5 && y === 1 ) this.gridCells[y][x] = 13; //L
                else if ( x === 1 && y === 2 ) this.gridCells[y][x] = 15; //N
                else if ( x === 1 && y === 3 ) this.gridCells[y][x] = 2; //A
                else if ( x === 1 && y === 4 ) this.gridCells[y][x] = 17; //P
            }
        }
    }
    
    cellClicked(cell: number) {
        console.log('cell clicked: ' + cell);
    }
}