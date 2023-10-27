import { TestBed } from '@angular/core/testing';

import { AdminTestCategoryService } from './admin-test-category.service';

describe('AdminTestCategoryService', () => {
  let service: AdminTestCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTestCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
