import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogService } from '../DialogService';

{$REPEAT}import {I{#NAME}Dialog{$NAME}Data,I{#NAME}Dialog{$NAME}Response, I{$NAME}Action } from './{$FILE}/{$FILE+Component}';
{$REPEATEND}
export type DialogMode={$REPEAT}'{$MODE}'{$REPEATDELIM} | {$REPEATEND};
export type I{#NAME}DialogData={$REPEAT}I{#NAME}Dialog{$NAME}Data{$REPEATDELIM} | {$REPEATEND};
export type I{#NAME}DialogResponse={$REPEAT}I{#NAME}Dialog{$NAME}Response{$REPEATDELIM} | {$REPEATEND};
export type IModeAndData={
   mode:DialogMode;
   data:I{#NAME}DialogData;
}

@Component({
  templateUrl: './{#FILE+DialogComponent}.html',
  styleUrls: ['./{#FILE+DialogComponent}.css']
})
export class {#NAME}DialogComponent implements OnInit, OnDestroy {

   mode:DialogMode;
   data:I{#NAME}DialogData;
  constructor(
    public dialogRef: MatDialogRef<{#NAME}DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private modeAndData: I{#NAME}DialogData
  ) {
     this.mode=modeAndData.mode;
     this.data=modeAndData.data;
     }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  close(response:I{#NAME}DialogResponse): void {
     this.dialogRef.close(response);
  }
{$REPEAT}   action{$NAME}(action:I{$NAME}Action): void {
      if (action.type==="CLOSE")
         this.close(action.response);
   }
{$REPEATEND}



}
