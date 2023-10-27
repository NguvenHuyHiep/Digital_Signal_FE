import { TestBed } from '@angular/core/testing';

import { HubCommonService } from './app-common.service';

describe('HubCommonService', () => {
  let service: HubCommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubCommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
