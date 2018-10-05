import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import { {#NAME}Dialog } from './{#FILE+Dialog}';
import { {#NAME}DialogComponent } from './{#FILE+DialogComponent}';
{$REPEAT}import {{$NAME}Component } from './{$FILE}/{$FILE+Component}';
{$REPEATEND}
@NgModule({
   declarations: [
         {$REPEAT}         {$NAME}Component,
         {$REPEATEND}         {#NAME}DialogComponent
         ],
         imports: [
         BrowserModule,
         CommonModule,
         MatDialogModule
         ],
         providers: [
         {#NAME}Dialog
         ],
         entryComponents: [{#NAME}DialogComponent]
})
export class {#NAME}DialogModule {
}
