import { Component, Input } from '@angular/core';
import { IssuedCommand } from '../issued_command';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-terminal-line',
  standalone: true,
  imports: [
    NgClass,
    NgFor
  ],
  templateUrl: './terminal-line.component.html',
  styleUrl: './terminal-line.component.css'
})
export class TerminalLineComponent {

  @Input() command!: IssuedCommand;
}
