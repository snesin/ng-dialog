import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { DialogView } from '../{#FORMAT+DialogView}';

export interface I{#NAME}Dialog{$NAME}Data {
};
export interface I{#NAME}Dialog{$NAME}Response {
};
interface I{$NAME}CloseAction {
  action: 'CLOSE';
  response?: I{#NAME}Dialog{$NAME}Response;
}
interface I{$NAME}ViewAction {
  action: 'VIEW';
  view: DialogView;
}
export type {$NAME}Action = I{$NAME}CloseAction | I{$NAME}ViewAction;

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
  changeView(view: DialogView) {
    const action: I{$NAME}ViewAction = {
      action: 'VIEW',
      view: view
    };
    this.emitter.emit(action);
  }
}
