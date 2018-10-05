import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogService } from '../DialogService';

export class I{#NAME}DialogData {
}
export class I{#NAME}DialogResponse {
}

@Component({
  templateUrl: './{#FILE+DialogComponent}.html',
  styleUrls: ['./{#FILE+DialogComponent}.css']
})
export class {#NAME}DialogComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<{#NAME}DialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: I{#NAME}DialogData
  ) { }

  ngOnInit() {
  }
  ngOnDestroy() {
  }
  ok(): void {
     const response:I{#NAME}DialogResponse={};
     this.dialogRef.close(response);
  }
}
