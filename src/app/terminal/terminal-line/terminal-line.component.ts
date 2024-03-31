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
  templateUrl: './terminal-line.component.html',
  styleUrl: './terminal-line.component.css'
})
export class TerminalLineComponent {

  lineType: typeof LineType = LineType;

  @Input() line!: TerminalLineOutput;

}
