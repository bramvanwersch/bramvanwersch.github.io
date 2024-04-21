import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-desktop-icon',
    standalone: true,
    imports: [
        NgStyle
    ],
    template: `
        <div class="desktop-icon" (dblclick)="on_dblclick()" [ngStyle]="{top: get_top(), left: get_left()}">
            <img class="desktop-icon-image" [src]="image">
            <div class="desktop-icon-text"><b>{{ name }}</b></div>
        </div>
    `,
    styles: `
        .desktop-icon{
            position: absolute;
            cursor: pointer;
            height: 65px;
            width: 65px;
            user-select: none;
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

    @Input() name!: string;
    @Input() position!: number;
    @Input() image!: string;

    @Output() open_window_event = new EventEmitter<string>();

    on_dblclick(){
        this.open_window_event.emit(this.name);
    }

    get_top(): string{
        return `${this.position * 90 + 5}px`; 
    }

    get_left(): string{
        return '5px';
    }

}
