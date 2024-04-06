import { Component, Input } from '@angular/core';
import { TerminalLineOutput, LineType } from '../output_lines';
import { NgClass, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'app-terminal-line',
    standalone: true,
    imports: [
        NgClass,
        NgSwitch,
        NgSwitchCase,
        NgFor
    ],
    template: `
  <div [ngSwitch]="line.type">
    <div *ngSwitchCase="lineType.MESSAGE">
        <div *ngFor="let l of line.lines" [innerHTML]="l" class="command-response">
        </div>
    </div>
    <div *ngSwitchCase="lineType.ERROR">
        <div *ngFor="let l of line.lines" [innerHTML]="l" class="error">
        </div>
    </div>
    <div *ngSwitchCase="lineType.COMMAND">
        <div>
            {{ line.prefix }}<span class="command-response">{{ line.lines[0] }}</span>
        </div>
    </div>
  </div>
`,
    styles: `
  .command-response{
      color: var(--response-color);
  }
  `
})
export class TerminalLineComponent {

    lineType: typeof LineType = LineType;

    @Input() line!: TerminalLineOutput;

}
