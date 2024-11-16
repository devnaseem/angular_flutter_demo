// src/app/preload-flutter.service.ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FlutterInitService } from './flutter-init.service';

/**
 * Extends the Angular Route interface to include custom properties
 * for preloading Flutter modules.
 */
interface CustomRoute extends Route {
  data?: {
    preloadFlutter?: boolean;
    hostElementId?: string;
    assetBase?: string;
    entrypointUrl?: string;
    // Add other custom data properties as needed
  };
}

@Injectable({
  providedIn: 'root',
})
export class PreloadFlutterService implements PreloadingStrategy {
  constructor(private flutterInit: FlutterInitService) {}

  /**
   * Preloads Flutter modules based on route configuration.
   * @param route The route configuration.
   * @param load The function to load the Angular module.
   * @returns An Observable that completes when preloading is done.
   */
  preload(route: CustomRoute, load: () => Observable<any>): Observable<any> {
    if (route.data?.preloadFlutter) {
      // Destructure necessary properties from route.data
      const { hostElementId, assetBase, entrypointUrl } = route.data;

      // Validate that all required properties are present
      if (!hostElementId || !assetBase || !entrypointUrl) {
        console.warn(
          `PreloadFlutterService: Missing one or more required properties in route.data for path "${route.path}".`
        );
        return of(null);
      }

      // Preload Flutter after a short delay to not block initial rendering
      return timer(1000).pipe(
        switchMap(() => {
          this.flutterInit.loadFlutterModule(
            hostElementId,
            assetBase,
            entrypointUrl
          );

          return load(); // Load the Angular module
        })
      );
    } else {
      return of(null);
    }
  }
}
