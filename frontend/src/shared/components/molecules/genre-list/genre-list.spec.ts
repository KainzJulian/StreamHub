import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreList } from './genre-list';

describe('GenreList', () => {
  let component: GenreList;
  let fixture: ComponentFixture<GenreList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenreList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenreList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
