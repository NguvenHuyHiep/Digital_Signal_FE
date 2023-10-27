import { Inject, Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { LhLanguageService } from '../../language/lh-language.service';
import { LH_API_VERSION } from 'projects/app-api/src/public-api';
import { TestCategoryService } from '../../../api/controller/test/testCategory.service';
import {Observable, catchError, mergeMap, of} from "rxjs";
import { TBTestCategoryDtoListCustomApiObjResponse } from '../../../api/models/tBTestCategoryDtoListCustomApiObjResponse';
import { TBTestCategoryCreateDto } from '../../../api/models/tBTestCategoryCreateDto';
import { TBTestCategoryUpdateDto } from '../../../api/models/tBTestCategoryUpdateDto';
import { StringListCustomApiObjResponse } from '../../../api/models/stringListCustomApiObjResponse';
import { TBTestCategoryDto } from '../../../api/models/tBTestCategoryDto';
import { FormGroupTestCategory, FormGroupTranslationItem } from 'projects/app-admin/src/app/modules/test/test-type';
import { ListTestCategoryInfoRes, TestCategoryInfo } from 'projects/app-admin/src/app/modules/test/test-info';
import { map, result } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AdminTestCategoryService {

  constructor(
    private testcategoryService: TestCategoryService,
    @Inject(LH_API_VERSION) private apiVersion: string,
    private languageService: LhLanguageService,
    private formBuilder: FormBuilder
  ) { }

  public getAllTestCategory(): Observable<TBTestCategoryDtoListCustomApiObjResponse>{
    return this.testcategoryService.testCategoryGetAll(this.apiVersion);
  }

  // public getAllTestCategories(): Observable<ListTestCategoryInfoRes>{
  //   return this.testcategoryService.testCategoryGetAll(this.apiVersion).pipe(
  //     mergeMap((testcategoryResponse: TBTestCategoryDtoListCustomApiObjResponse) => {
  //       let listTestCategoryInfoRes: ListTestCategoryInfoRes = {
  //         errors: testcategoryResponse.errors,
  //         message: testcategoryResponse.message,
  //         statusCode: testcategoryResponse.statusCode
  //       };
  //       if (testcategoryResponse.isError) {
  //         return of(listTestCategoryInfoRes);
  //       }
  //       if (!testcategoryResponse.result?.length ||
  //         testcategoryResponse.result?.length == 0) {
  //           return of(testcategoryResponse as ListTestCategoryInfoRes);
  //         }
  //       return this.getTestCategoryInfos(testcategoryResponse.result).pipe(
  //         map((result) => {
  //           listTestCategoryInfoRes.result = result;
  //           return listTestCategoryInfoRes;
  //         })
  //       )
  //     })
  //   );
  // }

  // getTestCategoryInfos(
  //   testcategories: Array<TBTestCategoryDto>
  // ): Observable<Array<TestCategoryInfo>> {
  //   let parentcategoryIds: Array<string> = testcategories
  //     .map((t) => t.parentCategoryId)
  //     .filter((t) => t !== null && t !== undefined) as Array<string>;

  //   return this.testcategoryService
  //     .te(parentcategoryIds.join(','), this.apiVersion)
  //     .pipe(
  //       map((result: TBTestCategoryDtoListCustomApiObjResponse) => {
  //         let categories = result.result;
  //         return testcategories.map(q => {
  //           return {
  //             testCategory: q
  //             , parentTestCategory: categories?.find(c => c.id === q.parentCategoryId)
  //           } as TestCategoryInfo;
  //         });
  //       }),
  //       catchError(
  //         (error) =>
  //           of(testcategories.map(q => {
  //             return {
  //               testCategory: q
  //             } as TestCategoryInfo;
  //           }))
  //       )
  //     );
  // }

  public add(testcategory: TBTestCategoryCreateDto): Observable<TBTestCategoryDtoListCustomApiObjResponse> {
    return this.testcategoryService.testCategoryAdd(this.apiVersion, testcategory);
  }

  public update(testcategory: TBTestCategoryUpdateDto): Observable<TBTestCategoryDtoListCustomApiObjResponse> {
    return this.testcategoryService.testCategoryUpdate(
      this.apiVersion,
      testcategory._id || '',
      testcategory
    ) as Observable<TBTestCategoryDtoListCustomApiObjResponse>;
  }

  public delete(test: string): Observable<string> {
    return this.testcategoryService.testCategoryDelete(test, this.apiVersion);
  }
  public deleteBatch(test: string[]): Observable<StringListCustomApiObjResponse> {
    return this.testcategoryService.testCategoryDeletes(this.apiVersion, test);
  }

  public buildTestCategoryForm(testcatgory?: TBTestCategoryDto): FormGroupTestCategory {
    let form = this.formBuilder.group({
      id: ['' || testcatgory?.id],
      slug: ['' || testcatgory?.slug],
      name: [testcatgory?.name, [Validators.maxLength(200)]],
      usedState: [testcatgory?.usedState],
      orders: [testcatgory?.orders],
      description: [testcatgory?.description, [Validators.maxLength(500)]],
      urlImage: [testcatgory?.urlImage],
      code: [testcatgory?.urlImage],
      parentCategoryId: ['' || testcatgory?.parentCategoryId]
    }) as FormGroupTestCategory;

    form.addControl('translation', this.formBuilder.array([]) as FormArray);
    this.languageService.supportLangs.forEach(lang => {
      let tran = testcatgory?.translation?.find(tran => tran.language == lang.value);
      const languageForm: FormGroupTranslationItem = this.formBuilder.group({
        name: [tran?.name, [Validators.maxLength(200)]],
        description: [tran?.description, [Validators.maxLength(500)]],
        language: [lang.value, Validators.required],
        languageLabel: [lang.label]
      }) as FormGroupTranslationItem;
      form.controls.translation?.push(languageForm);
    })
    return form;
  }
}
