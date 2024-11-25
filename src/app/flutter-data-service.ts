import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FlutterDataService {
  /**
   * Sets initial data for the Flutter module in the global window object.
   * @param data An object containing the initial data.
   */
  setFlutterInitialData(data: Record<string, any>): void {
    (window as any).flutterInitialData = JSON.stringify(data);
    console.log('flutterInitialData set:', data);
  }
}
