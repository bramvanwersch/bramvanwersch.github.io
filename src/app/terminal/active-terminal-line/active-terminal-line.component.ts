import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-active-terminal-line',
  standalone: true,
  imports: [],
  templateUrl: './active-terminal-line.component.html',
  styleUrl: './active-terminal-line.component.css'
})
export class ActiveTerminalLineComponent {

  @Output() terminalCommandEvent = new EventEmitter<string>();

  onEnter(event: Event){
    let value = (event.target as HTMLInputElement).value;
    if (value === ""){
      return;
    }
    (event.target as HTMLInputElement).value = "";
    this.terminalCommandEvent.emit(value);
  }
}
