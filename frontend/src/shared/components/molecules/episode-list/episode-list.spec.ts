import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeList } from './episode-list';

describe('EpisodeList', () => {
  let component: EpisodeList;
  let fixture: ComponentFixture<EpisodeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
