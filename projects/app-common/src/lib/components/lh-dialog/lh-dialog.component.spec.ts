import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LhDialogComponent } from './lh-dialog.component';

describe('LhDialogComponent', () => {
  let component: LhDialogComponent;
  let fixture: ComponentFixture<LhDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LhDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LhDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
