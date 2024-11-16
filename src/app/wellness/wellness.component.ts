// src/app/wellness/wellness.component.ts
import { Component, HostListener, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FlutterInitService } from '../flutter-init.service';

@Component({
  selector: 'app-wellness',
  standalone: true,
  templateUrl: './wellness.component.html',
  styles: [`
    /* Your styles here */
    .spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      color: #0C4762;
    }
  `],
})
export class WellnessComponent implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private flutterInit: FlutterInitService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    // Initialize Flutter via the service
    this.flutterInit.loadFlutterModule(
      'flutter-app-wellness', // Unique host element ID
      'assets/flutter/wellness/', // Asset base path for wellness
      'assets/flutter/wellness/main.dart.js' // Entrypoint URL for wellness
    );
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
