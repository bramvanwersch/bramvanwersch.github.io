import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DesktopComponent } from './components/desktop.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        DesktopComponent
    ],
    template: `
    <div id="main">
        <app-desktop>
        </app-desktop>
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
