import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { DialogService } from '../DialogService';

import { {#NAME}DialogComponent, DialogMode, I{#NAME}DialogData, I{#NAME}DialogResponse, IModeAndData } from './{#FILE+DialogComponent}.ts';
{$REPEAT}import { I{#NAME}Dialog{$NAME}Data, I{#NAME}Dialog{$NAME}Response } from './{$FILE)/{$FILE+Component}.ts';
{$ENDREPEAT}
@Injectable({
  providedIn: 'root'
})
export class {#NAME}Dialog {
  constructor(private dialogService: DialogService, private dialog: MatDialog) {
  }
  private open<T>(mode:DialogMode,data:I{#NAME}DialogData): Observable<T> {
     const modeAndData:IModeAndData={mode:mode,data:data};
    return this.dialog.open({#NAME}DialogComponent, this.dialogService.getDialogConfig({#WIDTH}, modeAndData)).afterClosed();
  }
{$REPEAT}  public open<I{#NAME}Dialog{$NAME}Response | undefined>{$NAME}(data:I{#NAME}Dialog{$NAME}Data): Observable<I{#NAME}Dialog{$NAME}Response | undefined> {
     return this.open('{$MODE}',data);
  }
{$ENDREPEAT}
{$REPEAT}  public is{$NAME}Response(response:I{#NAME}DialogResponse | undefined): response is I{#NAME}Dialog{$NAME}Response {
   return response!==undefined /* && more detection code here */;
}
{$ENDREPEAT}}
