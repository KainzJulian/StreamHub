import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaTemplate } from './media-template';

describe('MediaTemplate', () => {
  let component: MediaTemplate;
  let fixture: ComponentFixture<MediaTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
