import { Component, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

// Declare the global _flutter namespace
declare var _flutter: any;

@Component({
  selector: 'app-wellness',
  standalone: true,
  templateUrl: './wellness.component.html',
  styles: [`
    :host div {
      width: 100%;
      height: 600px;
      position: relative;
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
    accessToken: 'eyJraWQiOiJuSmNFMDFrVkFjMG1RMzBDSTVJMnRPUUorTmExbVRqc3FmWE1WSW9QdU9rPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIxOTRiMmQzYS04ZDdlLTQzMzgtOTEwMS0zYjY0MmVjNDZkMTMiLCJldmVudF9pZCI6ImY1NzY1MmZjLTdlZDYtNDEzYy05MTk1LTdiZDU3YzY3NjI3YSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MzEzOTk5NzgsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5jYS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvY2EtY2VudHJhbC0xX2Z5dm9Bb25LTiIsImV4cCI6MTczMTQ4NjQwMiwiaWF0IjoxNzMxNDAwMDAyLCJqdGkiOiIzNjE1NjE5NS0yMzVhLTRhYzktOWQ3OC1iZGFiYTAyYzA1MDYiLCJjbGllbnRfaWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsInVzZXJuYW1lIjoiMTk0YjJkM2EtOGQ3ZS00MzM4LTkxMDEtM2I2NDJlYzQ2ZDEzIn0.paUzWsHh87ThaKeadtDy4yL_Q8k84S5IOngbZf6zuh-3Ez4Pknt-ThhUWoL9Lhy7VhUnlNUSk31_bGMp4JRFKzbqQEooxYFanRMJesNqsruBk0G1N-Kia-cG6LQDs2lXx39D6aOSiJ9_bzzOqS0Phj5uiyU8LayIpgpjdAL0CnlS2CikjM6OFhGkY_0RgU-x1-jRniqy3Zk3Gii1W3DRWEDfPovxNqVnjPrL6kQpGuQBMfr6E_xupNFAfdgw6PtgEm_RYO61N8WBaZqK3XNXT36YlJQvgn5-vWhvdqD5keTCj7FYXdElcpjP6zB1uI4zQD41Sc8H0TlA7rmx261wjQ',
    identityToken: 'eyJraWQiOiJIOUIxcUw2aDFwbjJnQjVoNWF3amV1a0ZOOURZMHdHYXhZaVB5Uk80bGg0PSIsImFsZyI6IlJTMjU2In0.eyJpY2FuX2VuYWJsZWQiOiJmYWxzZSIsInN1YiI6IjE5NGIyZDNhLThkN2UtNDMzOC05MTAxLTNiNjQyZWM0NmQxMyIsInVzZXJfY2xhaW1zIjoiW3tcInN5c3RlbVwiOlwiYWxheWFjYXJlXCIsXCJhdXRob3JpemVkSWRzXCI6W1wiNDYxNlwiLFwiNDY5NlwiXX1dIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImNpdHVzIjoie30iLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2NhLWNlbnRyYWwtMV9meXZvQW9uS04iLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiIxOTRiMmQzYS04ZDdlLTQzMzgtOTEwMS0zYjY0MmVjNDZkMTMiLCJ1c2VyX2NsYWltc192MiI6Ilt7XCJwc0lkXCI6XCI4OTcxNjYwMDA0XCIsXCJzeXN0ZW1UeXBlXCI6XCJob21lQ2FyZVwiLFwiYXV0aG9yaXplZFN5c3RlbXNcIjpbe1wiaWRcIjpcIjQ2MTZcIixcIm5hbWVcIjpcImFsYXlhY2FyZVwiLFwidXNlclR5cGVcIjpcImNsaWVudFwiLFwidGVuYW50c1wiOltcIkRlZmF1bHRcIl19XX0se1wicHNJZFwiOlwiODk3MTY2MDAxNFwiLFwic3lzdGVtVHlwZVwiOlwiaG9tZUNhcmVcIixcImF1dGhvcml6ZWRTeXN0ZW1zXCI6W3tcImlkXCI6XCI0Njk2XCIsXCJuYW1lXCI6XCJhbGF5YWNhcmVcIixcInVzZXJUeXBlXCI6XCJjbGllbnRcIixcInRlbmFudHNcIjpbXCJEZWZhdWx0XCJdfV19XSIsImN1c3RvbTphY2NlcHRlZF9kaWdpX3Rlcm1zIjoiMSIsImdpdmVuX25hbWUiOiJtYWRkeSIsImN1c3RvbTphY2NlcHRlZF90ZXJtcyI6IjEiLCJhdWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsImV2ZW50X2lkIjoiZjU3NjUyZmMtN2VkNi00MTNjLTkxOTUtN2JkNTdjNjc2MjdhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MzEzOTk5NzgsInBob25lX251bWJlciI6IisxNTE5NzIyMzQxNiIsImN1c3RvbTpsYXN0X2xvZ2luIjoiMTczMTQwMDAwMSIsImV4cCI6MTczMTQ4NjQwMiwiaWF0IjoxNzMxNDAwMDAyLCJmYW1pbHlfbmFtZSI6ImdyZWVuIiwiY3VzdG9tOnByZWZlcnJlZF9sYW5ndWFnZSI6ImVuIiwiZW1haWwiOiJncmVlbjIxQG1haWxpbmF0b3IuY29tIn0.qP7bD3L_N4saU2NneVlkRS6xFoUYHB_KEBawBE0VKEXMThyDl4vBt0411EP_nJmYJ-q-Ndrx54eY6FppUaiARUZhnp8qe_aR96OwYPzo5uyx2ultkkp0Esj4PYBEyGQAnLG5VfuSxHTEmjbifZe_96-6_Pf1yu8pJVv-HYCm3gg2t2iNG9xGhFSXyjnJLW2fPbQnnhtagxUxzBDYMGPgljNculbeidRIrT1-RWI33qznlJ8PN6jK3rAZ9dlswbgQ4cSqltHfDK0e2oUW6gqrUampvN_wLHiYLe8n8csclvJw3gIsvgK3M8WXGbpuwZzueTqRCysznBHyO7Zciwz4Ng',
    systemId: '8971660004',
    env: 'dev',
  };

  ngAfterViewInit(): void {
    const target: HTMLElement = this.flutterTarget.nativeElement;
    console.log('Initializing Flutter app in target:', target);

    // Define the initial data in a global JS variable
    window.flutterInitialData = JSON.stringify(this.initialData);

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
