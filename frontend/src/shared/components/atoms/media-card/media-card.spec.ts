import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCard } from './media-card';

describe('MediaCard', () => {
  let component: MediaCard;
  let fixture: ComponentFixture<MediaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
