import { Component, AfterViewInit, OnDestroy, NgZone, HostListener } from '@angular/core';
import { FlutterInitService } from '../flutter-init.service';
import { FlutterDataService } from '../flutter-data-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-wellness',
  standalone: true,
  templateUrl: './wellness.component.html',
})
export class WellnessComponent implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private flutterInit: FlutterInitService,
    private flutterDataService: FlutterDataService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.flutterDataService.setFlutterData({
      accessToken: 'initial_access_token',
      identityToken: 'initial_identity_token',
      systemId: 'initial_system_id',
      env: 'dev',
    });

    this.flutterInit.loadFlutterModule(
      'flutter-app-wellness',
      'assets/flutter/wellness/',
      'assets/flutter/wellness/main.dart.js'
    );

    // Example: Simulate dynamic data change
    // setTimeout(() => {
    //   this.flutterDataService.setFlutterData({ accessToken: 'updated_token' });
    // }, 5000);
  }

  // Function to update Flutter data with some random values
  updateFlutterData(): void {
    // Generate random data (for demonstration)
    const updatedData = {
      accessToken: `updated_token_${Math.floor(Math.random() * 1000)}`,
      identityToken: `updated_identity_${Math.floor(Math.random() * 1000)}`,
      systemId: `updated_system_${Math.floor(Math.random() * 1000)}`,
      env: 'prod'
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
