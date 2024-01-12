import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DsdFile } from '@app-api/lib/api/models/dsdFile';
import { ResponseStatus } from '@app-api/lib/api/models/responseStatus';
import { Tree } from '@app-api/lib/api/models/tree';
import { AdminCategoryService } from '@app-api/lib/modules/admin/admin-category/admin-category.service';
import { AdminFileService } from '@app-api/lib/modules/admin/admin-file/admin-file.service';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { forEach } from 'lodash';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  NzFormatBeforeDropEvent,
  NzFormatEmitEvent,
  NzTreeNode,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
} from 'rxjs';

@Component({
  selector: 'app-admin-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
})
export class FilesComponent implements OnInit {
  isPageLoading: boolean = false;
  nodes: NzTreeNodeOptions[] = [];

  searchControl = new FormControl();
  searchChanges$: Observable<string>;
  searchInput: string = '';

  previewFile: {
    isVisible: boolean;
    dsdFile?: DsdFile;
    categoryId?: number;
    src?: any;
    blob?: Blob;
  } = {
    isVisible: false,
  };

  // paging variables
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;

  isShowAddCategoryModal: boolean = false;

  categoryForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private translateService: TranslateService,
    private adminFileService: AdminFileService,
    private adminCategoryService: AdminCategoryService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
    this.categoryForm = this.adminCategoryService.buildForm();
    this.searchChanges$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((value) => value.trim().toLowerCase())
    );

    this.searchChanges$.subscribe({
      next: (value) => {
        this.onSearchCategoryTree(value);
      },
    });
  }

  ngOnInit(): void {
    this.getCategoryTree();
  }

  navigateToCreate = (): void => {
    this.router.navigate(['./create'], {
      relativeTo: this.activatedRoute,
    });
  };

  getCategoryTree(): void {
    this.isPageLoading = true;
    this.adminCategoryService.getCategoryTree(this.searchInput).subscribe({
      next: (response) => {
        if (response && response.status === ResponseStatus.Success) {
          this.nodes = [];

          const listCategoryTree: Tree[] = response?.data ?? [];
          forEach(listCategoryTree, (categoryTree: Tree) => {
            const node: NzTreeNodeOptions = {
              title: this.translateService.instant(categoryTree.title ?? ''),
              key: categoryTree.key ?? '',
              isLeaf: categoryTree.isLeaf ?? false,
            };

            this.nodes.push(node);
          });
        } else {
          this.message.error(
            this.translateService.instant('module.file.error.get')
          );
        }
      },
      error: (err) => {
        // TODO i18n
        this.message.error('Error', err);
        this.isPageLoading = false;
      },
      complete: () => {
        this.isPageLoading = false;
      },
    });
  }

  delete(file: DsdFile) {
    this.modalService.confirm({
      nzTitle:
        this.translateService.instant('module.file.modalDeleteFile') +
        `${file.name}` +
        ' ?',
      nzOnOk: () => {
        new Promise((resolve, reject) => {
          return this.adminFileService
            .deleteFile(file.path as string)
            .subscribe({
              next: (response) => {
                if (response && response?.status === ResponseStatus.Success) {
                  // this.files = this.files.filter((f) => f.path !== file.path);
                } else {
                  this.message.error(
                    this.translateService.instant('module.file.error.delete')
                  );
                }
                resolve;
              },
              error: (err) => {
                this.message.error(err);
                resolve;
              },
              complete: () => {
                resolve;
              },
            });
        }).catch((err) => console.log(err));
      },
    });
  }

  preview(filePath: string, categoryId?: number) {
    if (filePath) {
      if (filePath === this.previewFile.dsdFile?.path) {
        this.previewFile.isVisible = true;
        return;
      }

      this.previewFile = {
        isVisible: true,
      };

      forkJoin([
        this.adminFileService.getByPath(filePath),
        this.adminFileService.download(filePath),
      ]).subscribe({
        next: ([baseOutputDsdFile, blob]) => {
          if (
            baseOutputDsdFile &&
            baseOutputDsdFile.status === ResponseStatus.Success &&
            blob
          ) {
            this.previewFile.dsdFile = baseOutputDsdFile.data;
            this.previewFile.categoryId = categoryId;
            this.previewFile.src = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(blob)
            );
            this.previewFile.blob = blob;
          } else {
            this.message.error(
              this.translateService.instant('error.cannot-preview-file')
            );
          }
        },
        error: (err) => {
          console.log(err);

          this.message.error(
            this.translateService.instant('error.cannot-preview-file')
          );
        },
        complete: () => {},
      });
    } else {
      this.message.error(
        this.translateService.instant('error.cannot-preview-file')
      );
    }
  }

  isFile(fileType: string | any) {
    return fileType && fileType.startsWith('image/');
  }

  onCancelPreview() {
    this.previewFile.isVisible = false;
  }

  onDownloadPreview() {
    if (
      this.previewFile &&
      this.previewFile.blob &&
      this.previewFile.dsdFile?.path
    ) {
      saveAs(this.previewFile.blob, this.previewFile.dsdFile.path);
    } else {
      this.message.info(
        this.translateService.instant('error.cannot-download-file')
      );
    }
  }

  onRemoveFileFromCategory(
    categoryId?: number | undefined,
    fileId?: number | undefined
  ) {
    console.log(categoryId, fileId);

    if (categoryId && fileId && !isNaN(categoryId) && !isNaN(fileId)) {
      this.adminCategoryService
        .removeFilesFromCategoryByIds(categoryId, [fileId])
        .subscribe({
          next: (response) => {
            if (response && response?.status === ResponseStatus.Success) {
              this.previewFile.categoryId = undefined;
              this.getCategoryTree();
            } else {
              this.message.error(
                this.translateService.instant('module.category.error.remove')
              );
            }
          },
          error: (err) => {
            console.log(err);
            this.message.error(
              this.translateService.instant('module.category.error.remove')
            );
            this.isPageLoading = false;
          },
          complete: () => {
            this.isPageLoading = false;
            this.onCancelPreview();
          },
        });
    }
  }

  onNodeExpand(event: NzFormatEmitEvent): void {
    if (event.eventName === 'expand') {
      const node = event.node;
      if (
        node?.getChildren().length === 0 &&
        node?.isExpanded &&
        !this.isPageLoading
      ) {
        this.loadNode(this.getKeyId(node.key)).then((data) => {
          node.addChildren(data);
        });
      }
    }
  }

  loadNode(categoryId?: number): Promise<NzTreeNodeOptions[]> {
    return new Promise((resolve) => {
      this.isPageLoading = true;
      this.adminCategoryService
        .getCategoryTreeNode(categoryId as number, this.searchInput)
        .subscribe({
          next: (response) => {
            if (
              response &&
              response?.status === ResponseStatus.Success &&
              response.data
            ) {
              console.log(response.data);
              const newNodes: NzTreeNodeOptions[] = [];
              forEach(response.data, (categoryTree: Tree) => {
                const node: NzTreeNodeOptions = {
                  title: categoryTree.title ?? '',
                  key: categoryTree.key ?? '',
                  isLeaf: categoryTree.isLeaf ?? false,
                };
                newNodes.push(node);
              });
              resolve(newNodes);
            }
          },
          error: (err) => {
            console.log(err);
            resolve([]);
          },
          complete: () => {
            this.isPageLoading = false;
          },
        });
    });
  }

  onDoubleClick(event: NzFormatEmitEvent): void {
    if ((event.eventName = 'dbclick')) {
      const selectedNode: NzTreeNode = event.node as NzTreeNode;
      if (selectedNode && selectedNode.isLeaf) {
        const filePath = this.getKeyPath(selectedNode.key);
        const categoryKey = this.getKeyId(selectedNode.parentNode?.key);
        if (filePath) {
          this.preview(filePath, categoryKey);
        }
      }
    }
  }

  onCancelAddCategory(): void {
    this.isShowAddCategoryModal = false;
  }

  onOkCategory(): void {}

  onSubmitAddCategory(): void {
    if (this.categoryForm.valid) {
      console.log('submit', this.categoryForm.value);
      this.isPageLoading = true;
      this.adminCategoryService.create(this.categoryForm.value).subscribe({
        next: (response) => {
          if (response && response.status === ResponseStatus.Success) {
            this.getCategoryTree();
          } else {
            this.message.error(
              this.translateService.instant('module.category.error.add')
            );
          }
        },
        error: (err) => {
          console.log(err);
          this.message.error(
            this.translateService.instant('module.category.error.add')
          );
          this.isShowAddCategoryModal = false;
          this.isPageLoading = false;
        },
        complete: () => {
          this.isShowAddCategoryModal = false;
          this.isPageLoading = false;
        },
      });
    } else {
      Object.values(this.categoryForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // arrow func to fix getKeyId
  onBeforeDrop = (event: NzFormatBeforeDropEvent): Observable<boolean> => {
    console.log('onBeforeDrop', event);
    if (event.pos === 0) {
      const categoryId: number = this.getKeyId(event.node?.key) ?? NaN;
      console.log('categoryId: ', categoryId);

      const fileId: number = this.getKeyId(event.dragNode?.key) ?? NaN;
      console.log('fileId: ', fileId);

      if (
        event.dragNode.isLeaf &&
        categoryId &&
        fileId &&
        !isNaN(categoryId) &&
        !isNaN(fileId)
      ) {
        this.isPageLoading = true;
        return new Observable<boolean>((observer) => {
          this.adminCategoryService
            .assignFilesToCategoryByIds(categoryId, [fileId])
            .subscribe({
              next: (response) => {
                if (response && response?.status === ResponseStatus.Success) {
                  observer.next(true);
                } else {
                  this.message.error(
                    this.translateService.instant(
                      'module.category.error.assign'
                    )
                  );
                  observer.next(false);
                }
              },
              error: (err) => {
                console.log(err);
                this.message.error(
                  this.translateService.instant('module.category.error.assign')
                );
                this.isPageLoading = false;
                observer.next(false);
              },
              complete: () => {
                this.isPageLoading = false;
                observer.complete();
              },
            });
        });
      }
      return of(false);
    } else if (event.pos === -1) {
      const categoryId: number =
        this.getKeyId(event.dragNode?.parentNode?.key) ?? NaN;
      console.log('categoryId: ', categoryId);

      const fileId: number = this.getKeyId(event.dragNode?.key) ?? NaN;
      console.log('fileId: ', fileId);

      if (categoryId && fileId && !isNaN(categoryId) && !isNaN(fileId)) {
        this.isPageLoading = true;
        return new Observable<boolean>((observer) => {
          this.adminCategoryService
            .removeFilesFromCategoryByIds(categoryId, [fileId])
            .subscribe({
              next: (response) => {
                if (response && response?.status === ResponseStatus.Success) {
                  observer.next(true);
                } else {
                  this.message.error(
                    this.translateService.instant(
                      'module.category.error.remove'
                    )
                  );
                  observer.next(false);
                }
              },
              error: (err) => {
                console.log(err);
                this.message.error(
                  this.translateService.instant('module.category.error.remove')
                );
                this.isPageLoading = false;
                observer.next(false);
              },
              complete: () => {
                this.isPageLoading = false;
                observer.complete();
              },
            });
        });
      }
      return of(false);
    }
    return of(false);
  };

  onDrop(event: NzFormatEmitEvent): void {
    if (event.eventName === 'drop') {
      console.log('dropEvent', event);
    }
  }

  private getKeyPath(nodeKey?: string): string | undefined {
    if (!nodeKey) {
      return undefined;
    }
    const indexOfDash = nodeKey.indexOf('-');
    return nodeKey.substring(indexOfDash + 1);
  }

  private getKeyId(nodeKey?: string): number | undefined {
    if (!nodeKey) {
      return undefined;
    }
    const indexOfDash = nodeKey.indexOf('-');
    return nodeKey.substring(0, indexOfDash) as unknown as number;
  }

  onSearchCategoryTree(searchValue: string): void {
    this.searchInput = searchValue;
    this.getCategoryTree();
  }
}
