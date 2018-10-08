import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

{$IF}
import { {#NAME}DialogView } from './{#FILE}DialogView';
{$REPEAT}
import { I{#NAME}Dialog{$NAME}Data, I{#NAME}Dialog{$NAME}Response, {$NAME}Action, is{$NAME}CloseAction, is{$NAME}ViewAction } from './{$FILE}/{$FILE+Component}';
{$REPEATEND}
/* This type is a collection of all the different view parameter types. */
export type I{#NAME}DialogData = {$REPEAT}I{#NAME}Dialog{$NAME}Data{$REPEATDELIM} | {$REPEATEND};
/* This type is a collection of all the different view response types. */
export type I{#NAME}DialogResponse = {$REPEAT}I{#NAME}Dialog{$NAME}Response{$REPEATDELIM} | {$REPEATEND};
/* This type is a used to open the dialog to a view and with parameter data. */
export type IViewAndData = {
  view: {#NAME}DialogView;
  data: I{#NAME}DialogData;
}

/* The dialog component. This orchestrates the views and handles view action events. */
@Component({
  templateUrl: './{#FILE+DialogComponent}.html',
  styleUrls: ['./{#FILE+DialogComponent}.css']
})
export class {#NAME}DialogComponent implements OnInit, OnDestroy {

  /* The current view. */
  view: {#NAME}DialogView;
  /* The data passed in when opened. */
  data: I{#NAME}DialogData;

  /* The constructor gets the dialog reference and initialzes the view and its data. */
  constructor(public dialogRef: MatDialogRef<{#NAME}DialogComponent>, @Inject(MAT_DIALOG_DATA) viewAndData: IViewAndData) {
    this.view = viewAndData.view;
    this.data = viewAndData.data;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
  
  /* Closes the dialog, returning some data from a view. */
  close(response: I{#NAME}DialogResponse | undefined): void {
    this.dialogRef.close(response);
  }
{$REPEAT}
  /* This handles the actions for the {$NAME} view. */
  action{$NAME}(action: {$NAME}Action): void {
    if (is{$NAME}CloseAction(action))
      this.close(action.response);
    if (is{$NAME}ViewAction(action))
      this.view = action.view;
  }
{$REPEATEND}
}
{$IFELSE}
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
  close(response: I{#NAME}DialogResponse | undefined): void {
    this.dialogRef.close(response);
  }
  
}
{$IFEND}