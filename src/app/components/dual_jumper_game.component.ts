import { Component, OnInit } from '@angular/core';
import { TerminalLineComponent } from './terminal-line.component';
import { NgFor } from '@angular/common';
import { ActiveTerminalLineComponent } from './active-terminal-line.component';
import { WindowComponent } from './window.component';
import { SESSION } from '../src/session';
import { init } from '../src/game_src/dual_jumper_game.js';

@Component({
    selector: 'app-dual-jumper-game',
    standalone: true,
    imports: [
        TerminalLineComponent,
        ActiveTerminalLineComponent,
        WindowComponent,
        NgFor
    ],
    template: `
        <app-window [height]="'calc(80% - 50px)'" [width]="'calc(80% - 50px)'" [name]="name">
            <canvas id="jumper-canvas"></canvas>
        </app-window>
        `,
    styles: `
        #jumper-canvas{
            flex-grow: 1;
        }
    `
})
export class DualJumperGameComponent implements OnInit{

    name: string;

    constructor() {
        this.name = "Dual-jumper";
        SESSION.set_visibility(this.name, true);
    }
    ngOnInit(): void {
        init();
    }
}
