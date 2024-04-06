import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TerminalComponent } from './components/terminal.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        TerminalComponent
    ],
    template: `
    <div id="main">
        <app-terminal></app-terminal>
    </div>
    <router-outlet />
    `,
    styles: `
    #main{
        height: 100%;
        width: 100%;
    }
    `
})
export class AppComponent {
}
