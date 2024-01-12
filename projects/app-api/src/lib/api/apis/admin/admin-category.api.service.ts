import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseOutputListTree } from '../../models/baseOutputListTree';
import { Category } from '../../models/category';
import { BaseOutputCategory } from '../../models/baseOutputCategory';
import { BaseOutputListCategory } from '../../models/baseOutputListCategory';

@Injectable({
  providedIn: 'root',
})
export class AdminCategoryApiService {
  constructor(private http: HttpClient) {}

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string
  ) {
    return this.http.get<BaseOutputListCategory>(`/api/v1/admin/category`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
      },
    });
  }

  public getCategoryTree(search: string): Observable<BaseOutputListTree> {
    return this.http.get<BaseOutputListTree>(`/api/v1/admin/category/tree`, {
      params: { search },
    });
  }

  public getCategoryTreeNode(
    categoryId: number,
    search: string
  ): Observable<BaseOutputListTree> {
    return this.http.get<BaseOutputListTree>(
      `/api/v1/admin/category/tree/node/${categoryId}`,
      { params: { search } }
    );
  }

  public create(category: Category): Observable<BaseOutputCategory> {
    return this.http.post<BaseOutputCategory>(
      `/api/v1/admin/category`,
      category
    );
  }

  public delete(categoryId: number): Observable<BaseOutputCategory> {
    return this.http.delete<BaseOutputCategory>(
      `/api/v1/admin/category/${categoryId}`
    );
  }

  public assignFilesToCategoryByIds(
    categoryId: number,
    fileIds: number[]
  ): Observable<BaseOutputCategory> {
    return this.http.put<BaseOutputCategory>(
      `/api/v1/admin/category/${categoryId}/files`,
      fileIds
    );
  }

  public removeFilesFromCategoryByIds(
    categoryId: number,
    fileIds: number[]
  ): Observable<BaseOutputCategory> {
    return this.http.put<BaseOutputCategory>(
      `/api/v1/admin/category/remove/${categoryId}/files`,
      fileIds
    );
  }
}
