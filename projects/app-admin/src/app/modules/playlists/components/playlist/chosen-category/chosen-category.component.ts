import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { Category } from '@app-api/lib/api/models/category';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { AdminCategoryService } from '@app-api/lib/modules/admin/admin-category/admin-category.service';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-admin-chosen-category',
  templateUrl: './chosen-category.component.html',
  styleUrls: ['./chosen-category.component.scss'],
})
export class ChosenCategoryComponent implements ControlValueAccessor, OnInit {
  @Output() onDataCategoryChange: EventEmitter<Category> =
    new EventEmitter<Category>();
  categories?: Category[] = [];
  categoryId?: number;

  isLoading: boolean = false;
  constructor(
    private adminCategoryService: AdminCategoryService,
    private message: NzMessageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getAllCategory();
  }

  onTouched() {
    // This will be called when the input is touched (e.g., when it loses focus)
  }

  registerOnChange(fn: any): void {}

  onChange(value: number) {
    // This will be called when the value of the input changes
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: number): void {
    this.categoryId = value;
  }

  private getAllCategory() {
    this.isLoading = true;
    this.adminCategoryService.getCategoryByPaging(0, 1000).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.categories = response.data;
        } else {
          let errorsInStr: string = response.errors
            ?.map((e) => this.translateService.instant(e))
            .join(', ') as string;
          this.message.error(errorsInStr);
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onChangeData(id: number) {
    let category = this.categories?.find((e) => e.id === id);
    this.onDataCategoryChange.emit(category);
    this.onChange(id);
  }
}
