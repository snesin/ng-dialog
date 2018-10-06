import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogService } from '../DialogService';

import { DialogView } from './DialogView';
{$REPEAT}import { I{#NAME}Dialog{$NAME}Data, I{#NAME}Dialog{$NAME}Response, {$NAME}Action, is{$NAME}CloseAction, is{$NAME}ViewAction } from './{$FILE}/{$FILE+Component}';
{$REPEATEND}
export type I{#NAME}DialogData = {$REPEAT}I{#NAME}Dialog{$NAME}Data{$REPEATDELIM} | {$REPEATEND};
export type I{#NAME}DialogResponse = {$REPEAT}I{#NAME}Dialog{$NAME}Response{$REPEATDELIM} | {$REPEATEND};
export type IViewAndData = {
  view: DialogView;
  data: I{#NAME}DialogData;
}

@Component({
  templateUrl: './{#FILE+DialogComponent}.html',
  styleUrls: ['./{#FILE+DialogComponent}.css']
})
export class {#NAME}DialogComponent implements OnInit, OnDestroy {

  view: DialogView;
  data: I{#NAME}DialogData;

  constructor(public dialogRef: MatDialogRef<{#NAME}DialogComponent>, @Inject(MAT_DIALOG_DATA) viewAndData: IViewAndData) {
    this.view = viewAndData.view;
    this.data = viewAndData.data;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  close(response: I{#NAME}DialogResponse | undefined): void {
    this.dialogRef.close(response);
  }
{$REPEAT}
  action{$NAME}(action: {$NAME}Action): void {
    if (is{$NAME}CloseAction(action))
      this.close(action.response);
    if (is{$NAME}ViewAction(action))
      this.view = action.view;
  }
{$REPEATEND}
}
