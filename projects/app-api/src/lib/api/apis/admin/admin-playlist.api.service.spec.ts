import { TestBed } from '@angular/core/testing';

import { AdminPlaylistApiService } from './admin-playlist.api.service';

describe('AdminPlaylistApiService', () => {
  let service: AdminPlaylistApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPlaylistApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
