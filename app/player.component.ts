import {Component, Input, OnInit} from '@angular/core';
import {Player} from './player';

@Component({
    selector: 'player-component',
    template: `
        <section class="player-box">
            <div class="player-actions">
                <div class="current-letter">
                    {{player.currentLetter}}
                    <div *ngIf="!player.ready" class="time-till">
                        {{timeTillNextTurn()}}
                    </div>
                </div>
                <button (click)="trashLetter()" [disabled]="!player.ready" >skip</button>
                <div class="next-letter">{{player.nextLetter}}</div>
            </div>
            <div class="player-stats">
                <h1 class="player-score">{{player.score}}<small> PTS</small></h1>
                <p class="player-rank">RANK: {{playerRaking()}}</p>
            </div>
        </section>
    `
})


export class PlayerComponent implements OnInit  { 
    
    @Input() player : Player;
    
    constructor() {}
    ngOnInit() {
        this.player.beignGame();
    }
    
    timeTillNextTurn(){
        return Math.round( this.player.timeRemaining() / 1000 );
    }
    
    playerRaking(){
        return `1 / 1`; //TODO. get this from a service from the server
    }
    
    trashLetter(){
        console.log('trash clicked');
        this.player.skipTurn();
    }
}