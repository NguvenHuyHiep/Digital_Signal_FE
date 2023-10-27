import {Inject, Injectable} from '@angular/core';
import {LH_API_VERSION} from 'projects/app-api/src/public-api';
import {LhLanguageService} from '../../language/lh-language.service';
import {FormBuilder, Validators} from '@angular/forms';
import {catchError, map, mergeMap, Observable, of} from "rxjs";
import {TestSectionService} from '../../../api/controller/test/testSection.service';
import {TBTestSectionDtoListCustomApiObjResponse} from '../../../api/models/tBTestSectionDtoListCustomApiObjResponse';
import {TBTestSectionDto} from '../../../api/models/tBTestSectionDto';
import {StringListCustomApiObjResponse} from '../../../api/models/stringListCustomApiObjResponse';
import {TBTestSectionCreateDto} from '../../../api/models/tBTestSectionCreateDto';
import {TBTestSectionUpdateDto} from '../../../api/models/tBTestSectionUpdateDto';
import {FormGroupTestSection} from 'projects/app-admin/src/app/modules/test/test-type';
import {ListTestInfoRes, TestInfo} from "../../../../../../app-admin/src/app/modules/test/test-info";
import {TestService} from "../../../api/controller/test/test.service";
import {TBTestDtoIListCustomApiObjResponse} from "../../../api/models/tBTestDtoIListCustomApiObjResponse";
import {result} from "lodash";
import {TBTestSectionCustomApiObjResponse} from "../../../api/models/tBTestSectionCustomApiObjResponse";
import {TBTestSectionDtoCustomApiObjResponse} from "../../../api/models/tBTestSectionDtoCustomApiObjResponse";

@Injectable({
  providedIn: 'root'
})
export class AdminTestSectionService {

  constructor(
    private testSectionService: TestSectionService,
    @Inject(LH_API_VERSION) private apiVersion: string,
    private languageService: LhLanguageService,
    private formBuilder: FormBuilder,
    private testService: TestService,
  ) {
  }

  public getAll(): Observable<TBTestSectionDtoListCustomApiObjResponse> {
    return this.testSectionService.testSectionGetAll(this.apiVersion);
  }

  public getTests(testId: string): Observable<TBTestSectionDtoListCustomApiObjResponse> {
    return this.testSectionService.testSectionGetByTestId(testId, this.apiVersion)
  }

  public add(testSection: TBTestSectionCreateDto): Observable<TBTestSectionDtoCustomApiObjResponse> {
    return this.testSectionService.testSectionAdd(this.apiVersion, testSection);
  }

  public update(testSection: TBTestSectionUpdateDto): Observable<TBTestSectionDtoCustomApiObjResponse> {
    return this.testSectionService.testSectionUpdate(
      this.apiVersion,
      testSection._id || '',
      testSection
    ) as Observable<TBTestSectionDtoCustomApiObjResponse>;
  }

  public delete(testSection: string): Observable<string> {
    return this.testSectionService.testSectionDelete(testSection, this.apiVersion);
  }

  public deleteBatch(testSection: string[]): Observable<StringListCustomApiObjResponse> {
    return this.testSectionService.testSectionDeletes(this.apiVersion, testSection);
  }

  public buildTestSectionForm(testsection?: TBTestSectionDto): FormGroupTestSection {
    let form = this.formBuilder.group({
      id: ['' || testsection?.id],
      slug: ['' || testsection?.slug],
      name: [testsection?.name, [Validators.maxLength(200)]],
      usedState: [testsection?.usedState],
      orders: [testsection?.orders],
      description: [testsection?.description, [Validators.maxLength(500)]],
      duration: [testsection?.duration],
      sectionSumMark: [testsection?.sectionSumMark],
      numQuestion: [testsection?.numQuestion],
      pointFailure: [testsection?.pointFailure],
      displayRandom: [testsection?.displayRandom],
      isRoundPoint: [testsection?.isRoundPoint],
      isRequire: [testsection?.isRequire],
      content: [testsection?.content, [Validators.maxLength(500)]],
      code: [testsection?.code],
      testId: [testsection?.testId],
    }) as FormGroupTestSection;

    return form;
  }

  getAllSection(): Observable<ListTestInfoRes> {
    return this.testSectionService.testSectionGetAll(this.apiVersion).pipe(
      mergeMap((testResponse: TBTestSectionDtoListCustomApiObjResponse) => {
        let listSectionInfoRes: ListTestInfoRes = {
          errors: testResponse.errors,
          message: testResponse.message,
          statusCode: testResponse.statusCode,
        };
        if (testResponse.isError) {
          return of(listSectionInfoRes);
        }
        if (!testResponse.result?.length || testResponse.result?.length == 0) {
          return of(testResponse as ListTestInfoRes);
        }
        return this.getTestSectionInfos(testResponse.result).pipe(
          map((result)=> {
            listSectionInfoRes.result = result;
            return listSectionInfoRes;
          })
        )
      })
    );
  }

  getTestSectionInfos(sections: Array<TBTestSectionDto>): Observable<Array<TestInfo>> {
    let testIds: Array<string> = sections
      .map((s) => s.testId)
      .filter((s) => s !== null && s !== undefined) as Array<string>;

    return this.testService
      .testGetByIdsBase(testIds.join(','), this.apiVersion)
      .pipe(
        map((result: TBTestDtoIListCustomApiObjResponse) => {
          let testIds = result.result;
          return sections?.map((s) => {
            return {
              section: s,
              testId: testIds?.find((i) => i.id === s.testId)
            } as TestInfo;
          });
        }),
        catchError((error) =>
          of(
            sections.map((s) => {
              return {
                section: s
              } as TestInfo;
            })
          )
        )
      );
  }
}
