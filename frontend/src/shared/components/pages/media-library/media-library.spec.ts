import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaLibrary } from './media-library';

describe('MediaLibrary', () => {
  let component: MediaLibrary;
  let fixture: ComponentFixture<MediaLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaLibrary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaLibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
