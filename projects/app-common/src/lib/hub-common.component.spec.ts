import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubCommonComponent } from './app-common.component';

describe('HubCommonComponent', () => {
  let component: HubCommonComponent;
  let fixture: ComponentFixture<HubCommonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HubCommonComponent]
    });
    fixture = TestBed.createComponent(HubCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
