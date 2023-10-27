import { TestBed } from '@angular/core/testing';

import { AdminTestSectionService } from './admin-test-section.service';

describe('AdminTestSectionService', () => {
  let service: AdminTestSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTestSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
