import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesPage } from './series-page';

describe('SeriesPage', () => {
  let component: SeriesPage;
  let fixture: ComponentFixture<SeriesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeriesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
