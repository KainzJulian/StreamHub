import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaPage } from './media-page';

describe('MediaPage', () => {
  let component: MediaPage;
  let fixture: ComponentFixture<MediaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
