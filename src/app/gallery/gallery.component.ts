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
        'eyJraWQiOiJuSmNFMDFrVkFjMG1RMzBDSTVJMnRPUUorTmExbVRqc3FmWE1WSW9QdU9rPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMjFhZTM1OC0zMWRlLTQwZmUtYTY0Yy03ODIxZjY3YmQ0NjEiLCJldmVudF9pZCI6ImFiZGE2NDEzLWVjM2MtNDBlYy1iMmQ2LWQ1NDZhYjc5ZDc3NiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MzgyMzQ2NzksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5jYS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvY2EtY2VudHJhbC0xX2Z5dm9Bb25LTiIsImV4cCI6MTczODkxMTEyNCwiaWF0IjoxNzM4ODI0NzI1LCJqdGkiOiI4Njg2OGIwMi1kYjg2LTRmOTktODMzNS0wMGVhMDk1Y2Q4ODYiLCJjbGllbnRfaWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsInVzZXJuYW1lIjoiZTIxYWUzNTgtMzFkZS00MGZlLWE2NGMtNzgyMWY2N2JkNDYxIn0.E4u3n-N7NAUhdvRDYvPa0plk5D-EASUgyUCR8HJJD-GZUUl79gbz1UwnMyRTl0rSiO6SVn4eXQZdy-QrzLLRGSttcja9uypwFS4QSX2r0kkf9RYP9elWbNjR7Veh99M1_M4K4aUUcM5HXDvJeJ3Lf1TOUvUqibP-TBiorAgHaZtubVfxXdlurq1_DXot8xL-71s0y7u_3NkffOSm3Z1shd0SJD3KgdDArW-U2wJO9k9wtTj4iL6wUZicFPkmfISQkdcxIomOouZZipe0wNVWf6BLmEkbM7RF68N0JOU2ZQclalLSBitvNRD658_-zmSg8AmtNV3-zs14-X9YTfpb2w',
      identityToken:
        'eyJraWQiOiJIOUIxcUw2aDFwbjJnQjVoNWF3amV1a0ZOOURZMHdHYXhZaVB5Uk80bGg0PSIsImFsZyI6IlJTMjU2In0.eyJjdXN0b206b25ib2FyZGluZ19zdGFnZSI6IkRPTkUiLCJzdWIiOiJlMjFhZTM1OC0zMWRlLTQwZmUtYTY0Yy03ODIxZjY3YmQ0NjEiLCJjaXR1cyI6Int9IiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmNhLWNlbnRyYWwtMS5hbWF6b25hd3MuY29tXC9jYS1jZW50cmFsLTFfZnl2b0FvbktOIiwiY3VzdG9tOmFjY2VwdGVkX2RpZ2lfdGVybXMiOiIxIiwiYXV0aF90aW1lIjoxNzM4MjM0Njc5LCJleHAiOjE3Mzg5MTExMjQsImlhdCI6MTczODgyNDcyNSwiY3VzdG9tOnByZWZlcnJlZF9sYW5ndWFnZSI6ImVuIiwiZW1haWwiOiJmZWxpbm9tYXJ5NzczQG1haWxpbmF0b3IuY29tIiwiaWNhbl9lbmFibGVkIjoiZmFsc2UiLCJ1c2VyX2NsYWltcyI6Ilt7XCJzeXN0ZW1cIjpcInByb2N1cmEtcHJpdmF0ZVwiLFwiYXV0aG9yaXplZElkc1wiOltcIjAwMDA2NjIyMTJcIl19XSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOnRydWUsImNvZ25pdG86dXNlcm5hbWUiOiJlMjFhZTM1OC0zMWRlLTQwZmUtYTY0Yy03ODIxZjY3YmQ0NjEiLCJ1c2VyX2NsYWltc192MiI6Ilt7XCJwc0lkXCI6XCIwMDAwNjYyMjEyXCIsXCJzeXN0ZW1UeXBlXCI6XCJob21lQ2FyZVwiLFwiYXV0aG9yaXplZFN5c3RlbXNcIjpbe1wiaWRcIjpcIjAwMDA2NjIyMTJcIixcIm5hbWVcIjpcInByb2N1cmEtcHJpdmF0ZVwiLFwidXNlclR5cGVcIjpcImNsaWVudFwiLFwidGVuYW50c1wiOltcIlByb2N1cmFfTGVhcGZyb2dOZXdcIl19XX1dIiwiZ2l2ZW5fbmFtZSI6ImZlbGlubyIsImN1c3RvbTphY2NlcHRlZF90ZXJtcyI6IjEiLCJhdWQiOiIyb29vNDkzZHBuNWNzN3J1aW80bG1wNDcyaSIsImV2ZW50X2lkIjoiYWJkYTY0MTMtZWMzYy00MGVjLWIyZDYtZDU0NmFiNzlkNzc2IiwidG9rZW5fdXNlIjoiaWQiLCJwaG9uZV9udW1iZXIiOiIrOTE2MzY0Njc0NTEzIiwiY3VzdG9tOmxhc3RfbG9naW4iOiIxNzM4ODI0NzA2IiwiZmFtaWx5X25hbWUiOiJtYXJ5In0.ALmHxyV59-Grnktl-etNR7b3jKKU3rh2I0qZK0SzCQb_SjMbBNZmqyPjpK8bzSm9FtNkswnNfex9aOSjU5CmwodotocpLecMMMGLrnFMJyRIpsPM4OPG2fPAAz0dBMYHAjE3LX2YKw0hMDqA9CqHtZVGJsyzGToIS9RhKW0QAPm54_vMYROUPfBIlOlLWssCf5EqGzHAliuSMoo2SCVp6QygJ9q2VrHyXASXnDOfxmtWQKG9xjPnyEXDuJ14BfnHcchqtxG4EndHNW3d_1KDD73YcWWltIM28PBkvQPHQQRACYaSTVKAkMFO_vKAmSwpPj6pMz4dE49M4Ro9Hs8KNA',
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

  @HostListener('window:permission_link_clicked', ['$event'])
  handleBackPressed(event: Event) {
    console.log('Received back_pressed event from Flutter');
    this.ngZone.run(() => {
      this.router.navigate(['/home']);
    });
  }
  @HostListener('window:full_screen_clicked', ['$event'])
  handleFullScreenClicked(event: Event) {
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    // Any necessary cleanup
  }
}
