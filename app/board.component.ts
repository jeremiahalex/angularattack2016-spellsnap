import {Component} from '@angular/core';

interface GridCell {
  y: number;
  x: number;
  content: number;
}

@Component({
    selector: 'game-board',
    template: `
        <section class="board">
            <div *ngFor="let row of gridCells" class="board-row">
                <div *ngFor="let cell of row" (click)="cellClicked(cell)"  class="board-cell">
                    {{alphabet.charAt(cell.content)}}
                </div>
            </div>
        </section>
    `
})
export class BoardComponent { 
    rowCount : number = 9;
    columnCount : number = 9;
    
    gridCells : GridCell[][];
    
    alphabet : string = ' *ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    constructor() {
        this.gridCells = [];
        
        for ( let y = 0; y < this.rowCount; ++y){
            this.gridCells[y] = [];
            for ( let x = 0; x < this.columnCount; ++x){
                this.gridCells[y][x] = { x: x, y: y, content: 0};
                //temp - we will read the cell values from the server but for now we're just testing our grid, so manuall add 
                if ( x % 3 === 1 && y % 3 === 1 ){
                    //a possible starter cell
                    this.gridCells[y][x].content = 1;
                }
                
                if ( x === 1 && y === 1 ) this.gridCells[y][x].content =  20; //S
                else if ( x === 2 && y === 1 ) this.gridCells[y][x].content =  17; //P
                else if ( x === 3 && y === 1 ) this.gridCells[y][x].content =  16; //E
                else if ( x === 4 && y === 1 ) this.gridCells[y][x].content =  13; //L
                else if ( x === 5 && y === 1 ) this.gridCells[y][x].content =  13; //L
                else if ( x === 1 && y === 2 ) this.gridCells[y][x].content =  15; //N
                else if ( x === 1 && y === 3 ) this.gridCells[y][x].content =  2; //A
                else if ( x === 1 && y === 4 ) this.gridCells[y][x].content =  17; //P
            }
        }
    }
    
    cellClicked(cell: GridCell) {
        console.log(`cell clicked at x: ${cell.x}, y: ${cell.x}. Content is: ${cell.content}`);
    }
}