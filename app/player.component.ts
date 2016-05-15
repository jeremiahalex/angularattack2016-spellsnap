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
                <div [ngClass]="btnClass()" (click)="trashLetter()"><i class="fa fa-trash fa-3x" aria-hidden="true"></i></div>
                <div class="next-letter">
                    {{player.nextLetter}}
                    <div *ngIf="!player.ready" class="time-till">
                    </div>
                </div>
            </div>
            <div class="player-stats">
                <h1 class="player-score">{{player.score}}<small> PTS</small></h1>
                <p *ngIf="player.rank >= 0" class="player-rank">RANK {{player.rank+1}}</p>
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
    
    btnClass() {
        if (!this.player.ready) return "btn btn-disabled";
        return "btn";
    }
    trashLetter(){
        if (!this.player.ready) return;
        
        console.log('trash clicked');
        this.player.skipTurn();
    }
}