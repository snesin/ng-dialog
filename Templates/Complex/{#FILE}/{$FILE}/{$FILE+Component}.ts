import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { DialogMode } from '../{#FORMAT+DialogMode}';

export interface I{#NAME}Dialog{$NAME}Data {
};
export interface I{#NAME}Dialog{$NAME}Response {
};
interface I{$NAME}CloseAction {
  action: 'CLOSE';
  response?: I{#NAME}Dialog{$NAME}Response;
}
interface I{$NAME}ModeAction {
  action: 'MODE';
  mode: DialogMode;
}
export type {$NAME}Action = I{$NAME}CloseAction | I{$NAME}ModeAction;

@Component({
  selector: '{#TAGLEAD}-{#NAME}-{$NAME}',
  templateUrl: './{$FILE+Component}.html',
  styleUrls: ['./{$FILE+Component}.css']
})
export class {$NAME}Component implements OnInit, OnDestroy {

  @Input() data!: I{#NAME}Dialog{$NAME}Data;
  @Output('action') emitter = new EventEmitter<{$NAME}Action>();
  constructor() {
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  close(response?: I{#NAME}Dialog{$NAME}Response) {
    const action: I{$NAME}CloseAction = {
      action: 'CLOSE',
      response: response
    };
    this.emitter.emit(action);
  }
  changeMode(mode: DialogMode) {
    const action: I{$NAME}ModeAction = {
      action: 'MODE',
      mode: mode
    };
    this.emitter.emit(action);
  }
}
