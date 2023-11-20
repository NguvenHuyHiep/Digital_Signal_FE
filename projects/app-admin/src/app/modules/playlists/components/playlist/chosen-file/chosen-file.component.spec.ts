import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenFileComponent } from './chosen-file.component';

describe('ChosenFileComponent', () => {
  let component: ChosenFileComponent;
  let fixture: ComponentFixture<ChosenFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChosenFileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChosenFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
