import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeviceComponent } from './group-device.component';

describe('GroupDeviceComponent', () => {
  let component: GroupDeviceComponent;
  let fixture: ComponentFixture<GroupDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
