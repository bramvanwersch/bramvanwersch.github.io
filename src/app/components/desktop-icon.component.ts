import { Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-desktop-icon',
    standalone: true,
    imports: [],
    template: `
        <div class="desktop-icon" (dblclick)="on_dblclick()">
            <img class="desktop-icon-image" src="assets/terminal-fill.svg">
            <div class="desktop-icon-text"><b>Terminal</b></div>
        </div>
    `,
    styles: `
        .desktop-icon{
            position: absolute;
            left: 5px;
            top: 5px;
            height: 65px;
            width: 65px;
        }

        .desktop-icon-image{
            width: 100%;
            height: 100%;
        }

        .desktop-icon-text{
            text-align: center;
        }
    `}
)
export class DesktopIconComponent {

    @Output() open_window_event = new EventEmitter<string>();

    on_dblclick(){
        this.open_window_event.emit("terminal");
    }

}

