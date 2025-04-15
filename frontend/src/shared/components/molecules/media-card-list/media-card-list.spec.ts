import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCardList } from './media-card-list';

describe('MediaCardList', () => {
  let component: MediaCardList;
  let fixture: ComponentFixture<MediaCardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaCardList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaCardList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
