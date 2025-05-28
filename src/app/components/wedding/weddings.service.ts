import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WeddingService {
  private _dragHoverTypeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public readonly dragHoverType$: Observable<boolean> = this._dragHoverTypeSubject.asObservable();

  public changeHoverType(isChair: boolean): void {
    if (isChair !== this._dragHoverTypeSubject.value) {
      this._dragHoverTypeSubject.next(isChair);
    }
  }
}
