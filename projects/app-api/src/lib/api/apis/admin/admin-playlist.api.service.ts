import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseOutputListPlaylist } from '../../models/baseOutputListPlaylist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminPlaylistApiService {
  constructor(private http: HttpClient) {}

  public getByPaging(
    page: number,
    size: number,
    sortBy: string,
    sortDirection: string,
    keyword: string
  ): Observable<BaseOutputListPlaylist> {
    return this.http.get<BaseOutputListPlaylist>(`/api/v1/admin/playlist`, {
      params: {
        page,
        size,
        sortBy,
        sortDirection,
        keyword,
      },
    });
  }
}
