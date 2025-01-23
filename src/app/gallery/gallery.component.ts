// src/app/gallery/gallery.component.ts
import {
  Component,
  HostListener,
  OnDestroy,
  AfterViewInit,
  NgZone,
} from '@angular/core';
import { Router } from '@angular/router';
import { FlutterInitService } from '../flutter-init.service';
import { FlutterDataService } from '../flutter-data-service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
  styles: [
    `
      /* Your styles here */
      .spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.5rem;
        color: #0c4762;
      }
    `,
  ],
})
export class GalleryComponent implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private flutterInit: FlutterInitService,
    private flutterDataService: FlutterDataService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.flutterDataService.setFlutterData({
      accessToken:
        'eyJraWQiOiJuSmNFMDFrVkFjMG1RMzBDSTVJMnRPUUorTmExbVRqc3FmWE1WSW9QdU9rPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMjFhZTM1OC0zMWRlLTQwZmUtYTY0Yy03ODIxZjY3YmQ0NjEiLCJldmVudF9pZCI6ImE1NGNiZGI2LWJmYzQtNDQyMy04MGI0LTY3YjRlNDRlNDE2NiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3Mzc2MDU2NjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5jYS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvY2EtY2VudHJhbC0xX2Z5dm9Bb25LTiIsImV4cCI6MTczNzY5MjA3NSwiaWF0IjoxNzM3NjA1Njc2LCJqdGkiOiIwNzQwNjQ2Ny04ODdkLTRkMzYtOTFlMy05MzNmN2JlM2U4ZDAiLCJjbGllbnRfaWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsInVzZXJuYW1lIjoiZTIxYWUzNTgtMzFkZS00MGZlLWE2NGMtNzgyMWY2N2JkNDYxIn0.g0BoY0nJj1E3UaXv4KuGeMZ7hnj-iADY1vvGDCUweyX0QhgSuJN0lYJDwiczBhPBkRDZWeq_-_Wu1hyBbCLs64c0e22Bnz3ekjvhjcN2Ilaj3h5ENKFDjFZ8c5TiroorKyKvfwkUjjhDlijyMTAtYjgroloBwM21965LVP9d7UGavQ3OJWea2h80UN848mOY0MqoJXsxDgRIODdPeTD5sHHAJZM50tV0UWGE6q0Vt_mJ68Pz-XObEV7orYFo5GuoPBtT3rYvDAA9LlFmMUTgg8QHRXgEBCaPRVrdSqnfvomSJI3O26s3cvljzw9HLgbCjgYl5VBW7L2GNJauBfVx2g',
      identityToken:
        'eyJraWQiOiJIOUIxcUw2aDFwbjJnQjVoNWF3amV1a0ZOOURZMHdHYXhZaVB5Uk80bGg0PSIsImFsZyI6IlJTMjU2In0.eyJjdXN0b206b25ib2FyZGluZ19zdGFnZSI6IkRPTkUiLCJzdWIiOiJlMjFhZTM1OC0zMWRlLTQwZmUtYTY0Yy03ODIxZjY3YmQ0NjEiLCJjaXR1cyI6Int9IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmNhLWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9jYS1jZW50cmFsLTFfZnl2b0FvbktOIiwiY3VzdG9tOmFjY2VwdGVkX2RpZ2lfdGVybXMiOiIxIiwiYXV0aF90aW1lIjoxNzM3NjA1NjY5LCJleHAiOjE3Mzc2OTIwNzUsImlhdCI6MTczNzYwNTY3NiwiY3VzdG9tOnByZWZlcnJlZF9sYW5ndWFnZSI6ImVuIiwiZW1haWwiOiJmZWxpbm9tYXJ5NzczQG1haWxpbmF0b3IuY29tIiwiaWNhbl9lbmFibGVkIjoiZmFsc2UiLCJ1c2VyX2NsYWltcyI6Ilt7XCJzeXN0ZW1cIjpcInByb2N1cmEtcHJpdmF0ZVwiLFwiYXV0aG9yaXplZElkc1wiOltcIjAwMDA2NjIyMTJcIl19XSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJlMjFhZTM1OC0zMWRlLTQwZmUtYTY0Yy03ODIxZjY3YmQ0NjEiLCJ1c2VyX2NsYWltc192MiI6Ilt7XCJwc0lkXCI6XCIwMDAwNjYyMjEyXCIsXCJzeXN0ZW1UeXBlXCI6XCJob21lQ2FyZVwiLFwiYXV0aG9yaXplZFN5c3RlbXNcIjpbe1wiaWRcIjpcIjAwMDA2NjIyMTJcIixcIm5hbWVcIjpcInByb2N1cmEtcHJpdmF0ZVwiLFwidXNlclR5cGVcIjpcImNsaWVudFwiLFwidGVuYW50c1wiOltcIlByb2N1cmFfTGVhcGZyb2dOZXdcIl19XX1dIiwiZ2l2ZW5fbmFtZSI6ImZlbGlubyIsImN1c3RvbTphY2NlcHRlZF90ZXJtcyI6IjEiLCJhdWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsImV2ZW50X2lkIjoiYTU0Y2JkYjYtYmZjNC00NDIzLTgwYjQtNjdiNGU0NGU0MTY2IiwidG9rZW5fdXNlIjoiaWQiLCJwaG9uZV9udW1iZXIiOiIrOTE2MzY0Njc0NTEzIiwiY3VzdG9tOmxhc3RfbG9naW4iOiIxNzM3NTk2MzAxIiwiZmFtaWx5X25hbWUiOiJtYXJ5In0.owX1I8hM6_yclUIV7dKdArE9fYwflEq-tM1HE5AMbTQkr5pfGudfPpAyq6VT5VO06i770mjTGNBB6J-V-hzVY6BtwNBtZc5dTA-c-GfPX4im0FQHusBm_5mFJM_82Z3GAlgI1HdDavaKuD8fZrRdGC1uGQZrL22ur8k6NhNGd8tahkLT3V5NNDNofHI2ds_pQOrucdhUwzYSZvPTLz8Fk-HcHad6yyrn9eGH33v5sLkg7pKyhngQfraSgd7PWyz96pqhlRp15DylmoxVG9QhNRaf4Zr7V659AtzCpR5DFyYqZEAxqDd4GrLSFpvcQausSyq4QNdrl_TYw9mwUUA67w',
      systemId: '0000662212',
      cognitoId: 'e21ae358-31de-40fe-a64c-7821f67bd461',
      env: 'dev',
    });

    // Initialize Flutter via the service
    this.flutterInit.loadFlutterModule(
      'flutter-app-gallery', // Unique host element ID
      'assets/flutter/gallery/', // Asset base path for gallery
      'assets/flutter/gallery/main.dart.js' // Entrypoint URL for gallery
    );
  }

  // Function to update Flutter data with some random values
  updateFlutterData(): void {
    // Generate random data (for demonstration)
    const updatedData = {
      accessToken: `updated_token_${Math.floor(Math.random() * 1000)}`,
      identityToken: `updated_identity_${Math.floor(Math.random() * 1000)}`,
      systemId: `updated_system_${Math.floor(Math.random() * 1000)}`,
      cognitoId: `updated_cognito_${Math.floor(Math.random() * 1000)}`,
      env: 'prod',
    };

    // Call the service to update the data
    this.flutterDataService.setFlutterData(updatedData);
  }

  @HostListener('window:back_pressed', ['$event'])
  handleBackPressed(event: Event) {
    console.log('Received back_pressed event from Flutter');
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }

  ngOnDestroy(): void {
    // Any necessary cleanup
  }
}
