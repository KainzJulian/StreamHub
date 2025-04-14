import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Banner } from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Banner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
