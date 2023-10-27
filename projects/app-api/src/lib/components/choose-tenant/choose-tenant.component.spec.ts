import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTenantComponent } from './choose-tenant.component';

describe('ChhooseTenantComponent', () => {
  let component: ChooseTenantComponent;
  let fixture: ComponentFixture<ChooseTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseTenantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
