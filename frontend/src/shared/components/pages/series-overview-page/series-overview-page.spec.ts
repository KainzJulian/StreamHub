import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesOverviewPage } from './series-overview-page';

describe('SeriesOverviewPage', () => {
  let component: SeriesOverviewPage;
  let fixture: ComponentFixture<SeriesOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesOverviewPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
