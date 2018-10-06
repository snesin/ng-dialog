import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DialogService } from '../{#FORMAT+DialogService}';

import { {#NAME}DialogComponent, I{#NAME}DialogData, I{#NAME}DialogResponse } from './{#FILE+DialogComponent}';

@Injectable({
  providedIn: 'root'
})
export class {#NAME}Dialog {
  constructor(private dialogService: DialogService, private dialog: MatDialog) {
  }
  public open(data: I{#NAME}DialogData): Observable<I{#NAME}DialogResponse | undefined> {
    return this.dialog.open({#NAME}DialogComponent, this.dialogService.getDialogConfig({#WIDTH}, data)).afterClosed();
  }
}
