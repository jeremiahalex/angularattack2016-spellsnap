enableProdMode();

import {bootstrap}          from '@angular/platform-browser-dynamic';
import {AppComponent}       from './app.component';
import {MultiplayerService} from './multiplayer.service';
import {enableProdMode}     from '@angular/core';

bootstrap(AppComponent, [MultiplayerService]);