import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LhUploadFileComponent } from './lh-upload-file.component';

describe('LhUploadFileComponent', () => {
  let component: LhUploadFileComponent;
  let fixture: ComponentFixture<LhUploadFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LhUploadFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LhUploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
