import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviePage } from './movie-page';

describe('MoviePage', () => {
  let component: MoviePage;
  let fixture: ComponentFixture<MoviePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
