import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistFileComponent } from './playlist-file.component';

describe('PlaylistFileComponent', () => {
  let component: PlaylistFileComponent;
  let fixture: ComponentFixture<PlaylistFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaylistFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaylistFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
