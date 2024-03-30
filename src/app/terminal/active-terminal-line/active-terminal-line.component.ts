import { Component } from '@angular/core';
import { Command } from '../../command';

@Component({
  selector: 'app-active-terminal-line',
  standalone: true,
  imports: [],
  templateUrl: './active-terminal-line.component.html',
  styleUrl: './active-terminal-line.component.css'
})
export class ActiveTerminalLineComponent {
  current_command: Command = new Command();

}
