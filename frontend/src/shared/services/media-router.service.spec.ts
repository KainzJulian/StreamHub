import { TestBed } from '@angular/core/testing';

import { MediaRouterService } from './media-router.service';

describe('MediaRouterService', () => {
  let service: MediaRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
