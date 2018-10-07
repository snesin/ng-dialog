import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DialogService } from '../{#FORMAT+DialogService}';

import { {#NAME}DialogView } from './{#FILE+DialogView}';
import { {#NAME}DialogComponent, I{#NAME}DialogData, I{#NAME}DialogResponse, IViewAndData } from './{#FILE+DialogComponent}';
{$REPEAT}import { I{#NAME}Dialog{$NAME}Data, I{#NAME}Dialog{$NAME}Response } from './{$FILE}/{$FILE+Component}';
{$REPEATEND}
/* This is the service used to open the dialog to a view. */
@Injectable({
  providedIn: 'root'
})
export class {#NAME}Dialog {

  constructor(private dialogService: DialogService, private dialog: MatDialog) {
  }

  /* This does the actual opening based on the view method used below. */
  public open<T>(view: {#NAME}DialogView, data: I{#NAME}DialogData, positionNear?: HTMLElement): Observable<T> {
    const viewAndData: IViewAndData = { view: view, data: data };
    return this.dialog.open({#NAME}DialogComponent, this.dialogService.createDialogConfig(viewAndData, {#WIDTH}, {#WIDTH}, positionNear)).afterClosed();
  }

  /* These are the public methods used to open the dialog to a particular view, and return some data when closed. */
{$REPEAT}  public open{$NAME}(data: I{#NAME}Dialog{$NAME}Data, positionNear?: HTMLElement): Observable<I{#NAME}Dialog{$NAME}Response | undefined> {
    return this.open<I{#NAME}Dialog{$NAME}Response | undefined>('{$ID}', data, positionNear);
  }
{$REPEATEND}
  /* These type guards to discern the differnt types of view return values. */
{$REPEAT}  public is{$NAME}Response(response: I{#NAME}DialogResponse | undefined): response is I{#NAME}Dialog{$NAME}Response {
    return response !== undefined /* && more detection code here */;
  }
{$REPEATEND}
}
