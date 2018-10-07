import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DialogService } from '../{#FORMAT+DialogService}';

import { {#NAME}DialogComponent, I{#NAME}DialogData, I{#NAME}DialogResponse } from './{#FILE+DialogComponent}';

/* This is the service used to open the dialog. */
@Injectable({
  providedIn: 'root'
})
export class {#NAME}Dialog {

  constructor(private dialogService: DialogService, private dialog: MatDialog) {
  }
  
  /* This is the public method used to open the dialog with some data, and return some data when closed. */
  public open(data: I{#NAME}DialogData, positionNear?: HTMLElement): Observable<I{#NAME}DialogResponse | undefined> {
    return this.dialog.open({#NAME}DialogComponent, this.dialogService.createDialogConfig(data, {#WIDTH}, {#WIDTH}, positionNear)).afterClosed();
  }
  
}
