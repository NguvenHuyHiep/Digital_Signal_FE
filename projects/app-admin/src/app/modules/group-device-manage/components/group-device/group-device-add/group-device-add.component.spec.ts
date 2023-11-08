import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeviceAddComponent } from './group-device-add.component';

describe('GroupDeviceAddComponent', () => {
  let component: GroupDeviceAddComponent;
  let fixture: ComponentFixture<GroupDeviceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDeviceAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDeviceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
