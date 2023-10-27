import { TestBed } from '@angular/core/testing';

import { AdminQuestionCategoryService } from './admin-question-category.service';

describe('AdminQuestionCategoryService', () => {
  let service: AdminQuestionCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminQuestionCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
