import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import 'zone.js';

function setupJEST() {
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
}

setupJEST();
