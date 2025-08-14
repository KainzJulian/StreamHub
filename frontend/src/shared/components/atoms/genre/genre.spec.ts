import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Genre } from './genre';

describe('Genre', () => {
  let component: Genre;
  let fixture: ComponentFixture<Genre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Genre],
    }).compileComponents();

    fixture = TestBed.createComponent(Genre);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw error if genre is undefined', () => {
    component.genre = undefined;
    expect(() => component.onGenreClicked()).toThrow(
      'onGenreClicked not triggered: this.genre is undefined'
    );
  });

  it('should emit genre when defined', () => {
    component.genre = 'Action';
    const spy = jest.spyOn(component.onClick, 'emit');

    component.onGenreClicked();

    expect(spy).toHaveBeenCalledWith('Action');
  });
});
