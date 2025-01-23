import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlutterDataService {
  private flutterDataSubject = new BehaviorSubject<Record<string, any>>({});

  /**
   * Sets the initial or updated data for Flutter and notifies subscribers.
   * @param data An object containing the new data.
   */
  setFlutterData(data: Record<string, any>): void {
    const updatedData = { ...this.flutterDataSubject.getValue(), ...data };
    this.flutterDataSubject.next(updatedData);

    // Update the window object for Flutter
    (window as any).flutterInitialData = JSON.stringify(updatedData);

    // Notify Flutter about the data change
    if (typeof (window as any).flutterUpdateData === 'function') {

      (window as any).flutterUpdateData(JSON.stringify(updatedData));
    }

    console.log('Flutter data updated:', updatedData);
  }

  /**
   * Returns an observable for tracking Flutter data changes.
   */
  getFlutterData$() {
    return this.flutterDataSubject.asObservable();
  }
}
