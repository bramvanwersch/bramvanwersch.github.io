import { Component, Input } from '@angular/core';
import { Command } from '../command';

@Component({
  selector: 'app-terminal-line',
  standalone: true,
  imports: [],
  templateUrl: './terminal-line.component.html',
  styleUrl: './terminal-line.component.css'
})
export class TerminalLineComponent {

  @Input() command!: Command;
}
