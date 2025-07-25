import { TestBed } from '@angular/core/testing';

import { MediaService } from './media.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClientTesting(), MediaService],
    });
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
