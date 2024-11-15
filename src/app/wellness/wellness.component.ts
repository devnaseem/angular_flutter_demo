import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';


// Declare the global _flutter namespace
declare var _flutter: any;

@Component({
  selector: 'app-wellness',
  standalone: true,
  templateUrl: './wellness.component.html',
  styles: [`
    :host div {
      width: 100%;
      height: 100vh;      position: relative;
    }
    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `],
})
export class WellnessComponent implements AfterViewInit {


  @ViewChild('flutterTarget', { static: true }) flutterTarget!: ElementRef;

  @Output() appLoaded: EventEmitter<Object> = new EventEmitter<Object>();

  private src: string = 'assets/flutter/main.dart.js'; // Adjust path as needed
  private assetBase: string = 'assets/flutter/'; // Adjust path as needed

  // Hardcoded initial data
  private initialData: any = {
    accessToken: 'eyJraWQiOiJuSmNFMDFrVkFjMG1RMzBDSTVJMnRPUUorTmExbVRqc3FmWE1WSW9QdU9rPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxOTRiMmQzYS04ZDdlLTQzMzgtOTEwMS0zYjY0MmVjNDZkMTMiLCJldmVudF9pZCI6IjkyZjE2MGM4LWRiMzMtNGI1ZC04Y2E1LWI4NWExNTM4ZjgzZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MzE1ODczNzUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5jYS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvY2EtY2VudHJhbC0xX2Z5dm9Bb25LTiIsImV4cCI6MTczMTY3MzgwNCwiaWF0IjoxNzMxNTg3NDA1LCJqdGkiOiJhZWJlNDhiZi1lZDE2LTQzZTgtYTFmOC04NjNhNjU3ZDU0MzIiLCJjbGllbnRfaWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsInVzZXJuYW1lIjoiMTk0YjJkM2EtOGQ3ZS00MzM4LTkxMDEtM2I2NDJlYzQ2ZDEzIn0.uGlcXx7K6SHVKr5EsDPLSohnUdak43eaht9hNF8jCpn45h_9kcDbCJsqMvT4poic6oRa4OwdY8TemUM4F1aec7JwY9vhuKkKsMj-k9OzqnXnaO786hz0VuVEek_w4-3_PHA1-4s6qkDQG_QAYCjlIjErGxulac8aA79uWQNMjGTmKq1X69YL8VuUOnfjz1QlfFVjpQ7d0YWNBWcGR-wRjAiTk10UcW-RZl6Hfcc1qdl1QGbZx2bgtuudFu-P1dO9wfcwjR473egp_yTPuVjYOYKxbCKST2wyF8-puRROPVryo95gALlElqVhArdvJU5LU-0PS082bjUGXyYexMm7iQ',
    identityToken: 'eyJraWQiOiJIOUIxcUw2aDFwbjJnQjVoNWF3amV1a0ZOOURZMHdHYXhZaVB5Uk80bGg0PSIsImFsZyI6IlJTMjU2In0.eyJpY2FuX2VuYWJsZWQiOiJmYWxzZSIsInN1YiI6IjE5NGIyZDNhLThkN2UtNDMzOC05MTAxLTNiNjQyZWM0NmQxMyIsInVzZXJfY2xhaW1zIjoiW3tcInN5c3RlbVwiOlwiYWxheWFjYXJlXCIsXCJhdXRob3JpemVkSWRzXCI6W1wiNDYxNlwiLFwiNDY5NlwiXX1dIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImNpdHVzIjoie30iLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2NhLWNlbnRyYWwtMV9meXZvQW9uS04iLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIxOTRiMmQzYS04ZDdlLTQzMzgtOTEwMS0zYjY0MmVjNDZkMTMiLCJ1c2VyX2NsYWltc192MiI6Ilt7XCJwc0lkXCI6XCI4OTcxNjYwMDA0XCIsXCJzeXN0ZW1UeXBlXCI6XCJob21lQ2FyZVwiLFwiYXV0aG9yaXplZFN5c3RlbXNcIjpbe1wiaWRcIjpcIjQ2MTZcIixcIm5hbWVcIjpcImFsYXlhY2FyZVwiLFwidXNlclR5cGVcIjpcImNsaWVudFwiLFwidGVuYW50c1wiOltcIkRlZmF1bHRcIl19XX0se1wicHNJZFwiOlwiODk3MTY2MDAxNFwiLFwic3lzdGVtVHlwZVwiOlwiaG9tZUNhcmVcIixcImF1dGhvcml6ZWRTeXN0ZW1zXCI6W3tcImlkXCI6XCI0Njk2XCIsXCJuYW1lXCI6XCJhbGF5YWNhcmVcIixcInVzZXJUeXBlXCI6XCJjbGllbnRcIixcInRlbmFudHNcIjpbXCJEZWZhdWx0XCJdfV19XSIsImN1c3RvbTphY2NlcHRlZF9kaWdpX3Rlcm1zIjoiMSIsImdpdmVuX25hbWUiOiJtYWRkeSIsImN1c3RvbTphY2NlcHRlZF90ZXJtcyI6IjEiLCJhdWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsImV2ZW50X2lkIjoiOTJmMTYwYzgtZGIzMy00YjVkLThjYTUtYjg1YTE1MzhmODNkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzE1ODczNzUsInBob25lX251bWJlciI6IisxNTE5NzIyMzQxNiIsImN1c3RvbTpsYXN0X2xvZ2luIjoiMTczMTU4NzQwMyIsImV4cCI6MTczMTY3MzgwNCwiaWF0IjoxNzMxNTg3NDA1LCJmYW1pbHlfbmFtZSI6ImdyZWVuIiwiY3VzdG9tOnByZWZlcnJlZF9sYW5ndWFnZSI6ImVuIiwiZW1haWwiOiJncmVlbjIxQG1haWxpbmF0b3IuY29tIn0.JJqdWf41UCfcPGtljX1p_6tKC6vVUPYnP4iACUR_VeCeIDn6mVt0SEhGGfnWd9O3P5Bf8pdsViSo5SeYFshPOHxIlS3tBYBqEAuW9K4IGxK_E29KUAmK10vabQbesG7fAeY9GrZ1PWff_u7glIRvRfEeIO2G8OxWdT7ySoJXFKvA7OXDRTwi1jaZzw7SJrsbe3OnyilWE1E7yUPvaSTxomphnd2U5_tsAud66Bc5_IbyarscDiVws8oeSuJ2zwk5WQhVXHBdgG6QxKZNUXNA6-JijrBhcJL9lHvlKQrV4nvdFUiPCUQiFvkp07VEBVIDTVy8J-nekPTj8C_XupOqWg',
    systemId: '8971660004',
    env: 'dev',
  };

  private backPressedListener = this.handleBackPressed.bind(this);

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    const target: HTMLElement = this.flutterTarget.nativeElement;
    console.log('Initializing Flutter app in target:-', target);

    // Define the initial data in a global JS variable
    window.flutterInitialData = JSON.stringify(this.initialData);

      // Listen for "back_pressed" event
      window.addEventListener('back_pressed', this.backPressedListener);

    // Dynamically load flutter.js if not already loaded
    if (typeof _flutter === 'undefined') {
      console.log('flutter.js not loaded. Loading...');
      const script = document.createElement('script');
      script.src = `${this.assetBase}flutter.js`;
      script.defer = true;
      script.onload = () => this.initializeFlutterApp(target);
      script.onerror = () => console.error('Failed to load flutter.js.');
      document.body.appendChild(script);
    } else {
      console.log('flutter.js already loaded.');
      this.initializeFlutterApp(target);
    }
  }

  handleBackPressed(event: Event) {
    console.log('Received back_pressed event from Flutter');
    // Navigate back to Home
    this.router.navigate(['/home']);
  }

  private initializeFlutterApp(target: HTMLElement) {
    console.log('Loading Flutter entrypoint:', this.src);

    _flutter.loader.loadEntrypoint({
      entrypointUrl: this.src,
      onEntrypointLoaded: async (engineInitializer: any) => {
        console.log('Entrypoint loaded. Initializing engine...');
        let appRunner = await engineInitializer.initializeEngine({
          hostElement: target,
          assetBase: this.assetBase,
          // multiViewEnabled: true, // Uncomment if using multi-view
        });
        console.log('Engine initialized. Running app...');
        await appRunner.runApp();
      }
    });

    target.addEventListener("flutter-initialized", (event: Event) => {
      let state = (event as CustomEvent).detail;
      window._debug = state;
      console.log('Flutter app has loaded:', state);
      this.appLoaded.emit(state);
    }, {
      once: true,
    });
  }

  ngOnDestroy(): void {
    //window.removeEventListener('flutter-button-pressed', this.flutterButtonPressedHandler);
    if (_flutter && _flutter.engine) {
      _flutter.engine.destroy();
    }
  }
}
