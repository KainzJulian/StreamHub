import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBar } from './header-bar';

describe('HeaderBar', () => {
  let component: HeaderBar;
  let fixture: ComponentFixture<HeaderBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
