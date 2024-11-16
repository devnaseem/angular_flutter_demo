// src/app/gallery/gallery.component.ts
import { Component, HostListener, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FlutterInitService } from '../flutter-init.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  templateUrl: './gallery.component.html',
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
export class GalleryComponent implements AfterViewInit, OnDestroy {
  constructor(
    private router: Router,
    private flutterInit: FlutterInitService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    // Initialize Flutter via the service
    this.flutterInit.loadFlutterModule(
      'flutter-app-gallery', // Unique host element ID
      'assets/flutter/gallery/', // Asset base path for gallery
      'assets/flutter/gallery/main.dart.js' // Entrypoint URL for gallery
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
