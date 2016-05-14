import {Component} from '@angular/core';
import {BoardComponent} from './board.component';

@Component({
    selector: 'my-app',
    directives: [BoardComponent],
    template: '<game-board></game-board>'
})
export class AppComponent { }