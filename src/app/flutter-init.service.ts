// src/app/flutter-init.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var _flutter: any;

@Injectable({
  providedIn: 'root',
})
export class FlutterInitService {
  private isFlutterJsLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Loads the shared flutter.js script.
   */
  private loadFlutterJs(assetBase: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isFlutterJsLoaded) {
        console.log('flutter.js already loaded.');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `${assetBase}flutter.js`;
      script.defer = true;
      script.onload = () => {
        console.log('flutter.js loaded successfully.');
        this.isFlutterJsLoaded = true;
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load flutter.js.');
        reject(new Error('Failed to load flutter.js'));
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Loads a Flutter module into the specified host element.
   * @param hostElementId The ID of the HTML element where the Flutter app will be embedded.
   * @param assetBase The base path for the module-specific Flutter assets.
   * @param entrypointUrl The URL to the module-specific Flutter app's entrypoint JavaScript file.
   */
  async loadFlutterModule(
    hostElementId: string,
    assetBase: string,
    entrypointUrl: string
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Flutter initialization skipped: not running in the browser.');
      return;
    }

    try {
      // Load flutter.js from the shared assets directory
      await this.loadFlutterJs('assets/flutter/');

      // Proceed to load the module-specific entrypoint
      this.loadEntrypoint(hostElementId, assetBase, entrypointUrl);
    } catch (error) {
      console.error('Error loading Flutter:', error);
    }
  }

  /**
   * Loads the Flutter entrypoint and initializes the Flutter app.
   * @param hostElementId The ID of the HTML element where the Flutter app will be embedded.
   * @param assetBase The base path for the module-specific Flutter assets.
   * @param entrypointUrl The URL to the module-specific Flutter app's entrypoint JavaScript file.
   */
  private loadEntrypoint(
    hostElementId: string,
    assetBase: string,
    entrypointUrl: string
  ): void {
    if (typeof _flutter === 'undefined') {
      console.error('Flutter loader is undefined.');
      return;
    }

    const target: HTMLElement | null = document.getElementById(hostElementId);
    if (!target) {
      console.error(`Host element with id "${hostElementId}" not found.`);
      return;
    }

    console.log('Loading Flutter entrypoint:', entrypointUrl);

    _flutter.loader.loadEntrypoint({
      entrypointUrl: entrypointUrl,
      onEntrypointLoaded: async (engineInitializer: any) => {
        console.log('Entrypoint loaded. Initializing engine...');
        const appRunner = await engineInitializer.initializeEngine({
          hostElement: target,
          assetBase: assetBase,
          
        });
        console.log('Engine initialized. Running app...');
        await appRunner.runApp();
      },
    });

    // Listen for Flutter initialization
    target.addEventListener(
      'flutter-initialized',
      (event: Event) => {
        const state = (event as CustomEvent).detail;
        window._debug = state;
        console.log('Flutter app has loaded:', state);
      },
      { once: true }
    );
  }
}
