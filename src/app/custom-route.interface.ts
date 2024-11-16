// src/app/custom-route.interface.ts
import { Route } from '@angular/router';

export interface CustomRoute extends Route {
  data?: {
    preloadFlutter?: boolean;
    hostElementId?: string;
    assetBase?: string;
    entrypointUrl?: string;
    // Add other custom data properties as needed
  };
}
