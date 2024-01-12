import { Injectable } from '@angular/core';
import { AdminCategoryApiService } from '@app-api/lib/api/apis/admin/admin-category.api.service';
import { BaseOutputCategory } from '@app-api/lib/api/models/baseOutputCategory';
import { BaseOutputListTree } from '@app-api/lib/api/models/baseOutputListTree';
import { Observable } from 'rxjs';
import { Category } from '../../../api/models/category';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryService {
  constructor(
    private formBuilder: FormBuilder,
    private adminCategoryApiService: AdminCategoryApiService
  ) {}

  public buildForm() {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
      status: ['ACTIVE'],
    });
  }

  public getCategoryByPaging(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
    keyword?: string
  ) {
    return this.adminCategoryApiService.getByPaging(
      page ?? 0,
      size ?? 10,
      sortBy ?? 'id',
      sortDirection ?? 'desc',
      keyword ?? ''
    );
  }

  public getCategoryTree(search: string): Observable<BaseOutputListTree> {
    return this.adminCategoryApiService.getCategoryTree(search);
  }

  public getCategoryTreeNode(
    categoryId: number,
    search: string
  ): Observable<BaseOutputListTree> {
    return this.adminCategoryApiService.getCategoryTreeNode(categoryId, search);
  }

  public create(category: Category): Observable<BaseOutputCategory> {
    return this.adminCategoryApiService.create(category);
  }

  public assignFilesToCategoryByIds(
    categoryId: number,
    fileIds: number[]
  ): Observable<BaseOutputCategory> {
    return this.adminCategoryApiService.assignFilesToCategoryByIds(
      categoryId,
      fileIds
    );
  }

  public removeFilesFromCategoryByIds(
    categoryId: number,
    fileIds: number[]
  ): Observable<BaseOutputCategory> {
    return this.adminCategoryApiService.removeFilesFromCategoryByIds(
      categoryId,
      fileIds
    );
  }
}
