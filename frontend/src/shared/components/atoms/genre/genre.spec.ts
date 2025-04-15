import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genre } from './genre';

describe('Genre', () => {
  let component: Genre;
  let fixture: ComponentFixture<Genre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genre]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Genre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
