import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogService } from '../DialogService';

import { DialogView } from './DialogView';
{$REPEAT}import {I{#NAME}Dialog{$NAME}Data,I{#NAME}Dialog{$NAME}Response, {$NAME}Action } from './{$FILE}/{$FILE+Component}';
{$REPEATEND}
export type I{#NAME}DialogData={$REPEAT}I{#NAME}Dialog{$NAME}Data{$REPEATDELIM} | {$REPEATEND};
export type I{#NAME}DialogResponse={$REPEAT}I{#NAME}Dialog{$NAME}Response{$REPEATDELIM} | {$REPEATEND};
export type IViewAndData={
   view:DialogView;
   data:I{#NAME}DialogData;
}

@Component({
  templateUrl: './{#FILE+DialogComponent}.html',
  styleUrls: ['./{#FILE+DialogComponent}.css']
})
export class {#NAME}DialogComponent implements OnInit, OnDestroy {

   view:DialogView;
   data:I{#NAME}DialogData;
  constructor(
    public dialogRef: MatDialogRef<{#NAME}DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private viewAndData: I{#NAME}DialogData
  ) {
     this.view=viewAndData.view;
     this.data=viewAndData.data;
     }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  close(response:I{#NAME}DialogResponse): void {
     this.dialogRef.close(response);
  }
{$REPEAT}   action{$NAME}(action:{$NAME}Action): void {
      if (action.type==="CLOSE")
         this.close(action.response);
      if (action.type==="VIEW")
         this.view=action.view;
   }
{$REPEATEND}}
