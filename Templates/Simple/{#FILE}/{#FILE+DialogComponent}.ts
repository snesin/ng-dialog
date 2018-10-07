import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DialogService } from '../{#FORMAT+DialogService}';

/* This is the open dialog parameter interface. */
export class I{#NAME}DialogData {
}
/* This is the close dialog response interface. */
export class I{#NAME}DialogResponse {
}

/* This is the close dialog component. */
@Component({
  templateUrl: './{#FILE+DialogComponent}.html',
  styleUrls: ['./{#FILE+DialogComponent}.css']
})
export class {#NAME}DialogComponent implements OnInit, OnDestroy {
  /* The constructor gets the dialog reference and gets the open parameter data. */
  constructor(public dialogRef: MatDialogRef<{#NAME}DialogComponent>, @Inject(MAT_DIALOG_DATA) private data: I{#NAME}DialogData) {
  }
  ngOnInit() {
  }
  ngOnDestroy() {
  }
  /* This method closes the dialog, returning a response. */
  close(response: I{#NAME}DialogResponse): void {
    this.dialogRef.close(response);
  }
}
