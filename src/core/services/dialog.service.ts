import { DestroyRef, inject, Injectable, Type } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private readonly _dialog = inject(MatDialog);

  public open<T, R = unknown | undefined>(
    component: Type<unknown>,
    config: MatDialogConfig<T>,
    destroyRef?: DestroyRef,
  ): Observable<R> {
    const dialogRef = this._dialog.open(component, config);

    const observable = dialogRef.afterClosed();

    return destroyRef ? observable.pipe(takeUntilDestroyed(destroyRef)) : observable;
  }

  public openMedium<T, R = unknown | undefined>(
    component: Type<unknown>,
    data: T,
    destroyRef?: DestroyRef,
  ): Observable<R> {
    return this.open<T, R>(
      component,
      {
        minWidth: 0,
        maxWidth: '100%',
        width: '60vw',
        autoFocus: '#accept',
        data,
      },
      destroyRef,
    );
  }

  public openSmall<T, R = unknown | undefined>(
    component: Type<unknown>,
    data: T,
    destroyRef?: DestroyRef,
  ): Observable<R> {
    return this.open<T, R>(
      component,
      {
        minWidth: 0,
        maxWidth: '100%',
        width: '45vw',
        autoFocus: '#accept',
        data,
      },
      destroyRef,
    );
  }
}
