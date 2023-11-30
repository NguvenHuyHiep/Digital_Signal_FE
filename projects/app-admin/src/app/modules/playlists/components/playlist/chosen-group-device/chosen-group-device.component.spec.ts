import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenGroupDeviceComponent } from './chosen-group-device.component';

describe('ChosenGroupDeviceComponent', () => {
  let component: ChosenGroupDeviceComponent;
  let fixture: ComponentFixture<ChosenGroupDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChosenGroupDeviceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChosenGroupDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
