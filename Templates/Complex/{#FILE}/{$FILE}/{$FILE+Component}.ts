import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

import { DialogView } from '../{#FORMAT+DialogView}';

/* This is the parameter type used to initialize the view. */
export interface I{#NAME}Dialog{$NAME}Data {
};

/* This is the data type this view returns. */
export interface I{#NAME}Dialog{$NAME}Response {
};

/* These are the action types that get emmited to the parent dialog. */
/* For new actions:                                                  */
/*   1) Create an interface.                                         */
/*   2) Add the interface to the {$NAME}Action type below.           */
/*   3) Create a type guard for the interface below.                 */
/*   4) Create an emitter function in the view component.            */

/* Emit this type to close the dialog with some data. */
export interface I{$NAME}CloseAction {
  type: 'CLOSE';
  response?: I{#NAME}Dialog{$NAME}Response;
}
/* Emit this type to change the dialog view. */
export interface I{$NAME}ViewAction {
  type: 'VIEW';
  view: DialogView;
}

/* This is the type that is a set of all action interfaces above. */
export type {$NAME}Action = I{$NAME}CloseAction | I{$NAME}ViewAction;

/* These are type guards for each of the action interfaces above. */
export function is{$NAME}CloseAction(action: {$NAME}Action | undefined): action is I{$NAME}CloseAction {
  return action !== undefined && action.type === 'CLOSE';
}
export function is{$NAME}ViewAction(action: {$NAME}Action | undefined): action is I{$NAME}ViewAction {
  return action !== undefined && action.type === 'VIEW';
}

/* This is the dialog view component. */
@Component({
  selector: '{#TAGLEAD}-{#NAME}-{$NAME}',
  templateUrl: './{$FILE+Component}.html',
  styleUrls: ['./{$FILE+Component}.css']
})
export class {$NAME}Component implements OnInit, OnDestroy {
  /* The initialization data is passed in as an input from the dialog template. */
  @Input() data!: I{#NAME}Dialog{$NAME}Data;
  /* The event data is passed to the dialog template. */
  @Output('action') emitter = new EventEmitter<{$NAME}Action>();
  constructor() {
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  /* These functions emit actions to the parent dialog. */
  /* This closes the dialog with some data. */
  close(response?: I{#NAME}Dialog{$NAME}Response) {
    const action: I{$NAME}CloseAction = {
      type: 'CLOSE',
      response: response
    };
    this.emitter.emit(action);
  }
  /* This changes the view of the dialog. */
  changeView(view: DialogView) {
    const action: I{$NAME}ViewAction = {
      type: 'VIEW',
      view: view
    };
    this.emitter.emit(action);
  }
}
