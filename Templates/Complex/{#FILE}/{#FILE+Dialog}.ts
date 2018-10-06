import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DialogService } from '../{#FORMAT+DialogService}';

import { DialogMode } from './{#FORMAT+DialogMode}';
import { {#NAME}DialogComponent, I{#NAME}DialogData, I{#NAME}DialogResponse, IModeAndData } from './{#FILE+DialogComponent}';
{$REPEAT}import { I{#NAME}Dialog{$NAME}Data, I{#NAME}Dialog{$NAME}Response } from './{$FILE}/{$FILE+Component}';
{$REPEATEND}
@Injectable({
  providedIn: 'root'
})
export class {#NAME}Dialog {
  constructor(private dialogService: DialogService, private dialog: MatDialog) {
  }
  private open<T>(mode: DialogMode, data: I{#NAME}DialogData): Observable<T> {
    const modeAndData: IModeAndData = { mode: mode, data: data };
    return this.dialog.open({#NAME}DialogComponent, this.dialogService.getDialogConfig({#WIDTH}, modeAndData)).afterClosed();
  }
{$REPEAT}  public open{$NAME}(data: I{#NAME}Dialog{$NAME}Data): Observable<I{#NAME}Dialog{$NAME}Response | undefined> {
    return this.open<I{#NAME}Dialog{$NAME}Response | undefined>('{$MODE}', data);
  }
{$REPEATEND}{$REPEAT}  public is{$NAME}Response(response: I{#NAME}DialogResponse | undefined): response is I{#NAME}Dialog{$NAME}Response {
    return response !== undefined /* && more detection code here */;
  }
{$REPEATEND}}
