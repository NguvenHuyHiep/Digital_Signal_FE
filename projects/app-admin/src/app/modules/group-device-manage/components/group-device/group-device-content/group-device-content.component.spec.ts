import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDeviceContentComponent } from './group-device-content.component';

describe('GroupDeviceContentComponent', () => {
  let component: GroupDeviceContentComponent;
  let fixture: ComponentFixture<GroupDeviceContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDeviceContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupDeviceContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
