import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Icon } from './icon';

describe('Icon', () => {
  let fixture: ComponentFixture<Icon>;
  let component: Icon;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
    component = fixture.componentInstance;
  });

  it('should render img with given iconName and alt', () => {
    component.iconName = 'test-icon';
    component.alt = 'Test Icon';
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img).toBeTruthy();
    expect(img.src).toContain('/icons/test-icon.svg');
    expect(img.alt).toBe('Test Icon');
    expect(img.draggable).toBe(false);
    expect(img.classList.contains('icon')).toBe(true);
  });

  it('should default to empty src and alt if no inputs are set', () => {
    fixture.detectChanges();
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');

    expect(img.src).toContain('/icons/.svg');
    expect(img.alt).toBe('');
  });
});
