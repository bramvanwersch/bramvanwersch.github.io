import { Component, EventEmitter, Output } from '@angular/core';
import { COMMAND_MAPPING } from '../command_definitions';

@Component({
  selector: 'app-active-terminal-line',
  standalone: true,
  imports: [],
  templateUrl: './active-terminal-line.component.html',
  styleUrl: './active-terminal-line.component.css'
})
export class ActiveTerminalLineComponent {

  @Output() terminalCommandEvent = new EventEmitter<string>();
  @Output() terminalMessageEvent = new EventEmitter<string>();

  onEnter(event: Event){
    let value = (event.target as HTMLInputElement).value;
    if (value === ""){
      return;
    }
    (event.target as HTMLInputElement).value = "";
    this.terminalCommandEvent.emit(value);
  }

  autocomplete(event: Event){
    event.preventDefault();
    let value = (event.target as HTMLInputElement).value;
    let matched = [];
    for (let key in COMMAND_MAPPING){
      if (key.startsWith(value)){
        matched.push(key);
      }
    }
    if (matched.length === 1){
      (event.target as HTMLInputElement).value = matched[0];
    }
    else if (matched.length > 1){

    }
  }
}
