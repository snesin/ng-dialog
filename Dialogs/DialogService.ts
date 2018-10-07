import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material';

/* A tempalte service for consistent dialog configurations. */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor() {
  }

  public createDialogConfig<T>(data: T | undefined, width: number): MatDialogConfig<T>
  public createDialogConfig<T>(data: T | undefined, width: number, approximateHeight: number | undefined, positionNear: HTMLElement | undefined): MatDialogConfig<T>
  public createDialogConfig<T>(data: T | undefined, width: number, height?: number, positionNear?: HTMLElement | undefined): MatDialogConfig<T> {
    const config = new MatDialogConfig<T>();
    if (positionNear) {
      const viewportSize = { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
      const buttonRect = positionNear.getBoundingClientRect();
      const dialogRect = { top: 0, left: 0, width: width, height: typeof (height) === "number" ? height : width };
      dialogRect.top = Math.floor(buttonRect.top + buttonRect.height / 2 - dialogRect.height / 2);
      if (dialogRect.top + dialogRect.height > viewportSize.height)
        dialogRect.top = viewportSize.height - dialogRect.height;
      if (dialogRect.top < 0)
        dialogRect.top = 0;
      dialogRect.left = buttonRect.left;
      if (dialogRect.left + dialogRect.width > viewportSize.width)
        dialogRect.left = buttonRect.right - dialogRect.width;
      if (dialogRect.left < 0)
        dialogRect.left = 0;
      config.position = {
        top: dialogRect.top + "px",
        left: dialogRect.left + "px"
      };
    }
    config.width = width + 'px';
    config.data = data;

    /* Use the config.panelClass and style.css to get consistent styling across dialogs. */
    config.panelClass = "app-Dialog";

    return config;
  }

}
