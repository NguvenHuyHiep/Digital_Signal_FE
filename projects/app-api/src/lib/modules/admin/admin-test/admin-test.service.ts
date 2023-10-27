import { Inject, Injectable } from '@angular/core';
import { LH_API_VERSION } from 'projects/app-api/src/public-api';
import { LhLanguageService } from '../../language/lh-language.service';
import { FormBuilder, Validators } from '@angular/forms';
import { TBTestDtoListCustomApiObjResponse } from '../../../api/models/tBTestDtoListCustomApiObjResponse';
import { TestService } from '../../../api/controller/test/test.service';
import { catchError, map, mergeMap, Observable, of } from 'rxjs';
import { TBTestCreateDto } from '../../../api/models/tBTestCreateDto';
import { StringCustomApiObjResponse } from '../../../api/models/stringCustomApiObjResponse';
import { TBTestUpdateDto } from '../../../api/models/tBTestUpdateDto';
import { StringListCustomApiObjResponse } from '../../../api/models/stringListCustomApiObjResponse';
import { TBTestDto } from '../../../api/models/tBTestDto';
import { TBSectionConciseDto } from '../../../api/models/tBSectionConciseDto';
import { TBQuestionDto } from '../../../api/models/tBQuestionDto';
import { TBTestDtoCustomApiObjResponse } from '../../../api/models/tBTestDtoCustomApiObjResponse';
import {
  FormGroupFeedBack,
  FormGroupQuestionInTest,
  FormGroupSectionInTest,
  FormGroupTest,
} from 'projects/app-admin/src/app/modules/test/test-type';

import { TestCategoryService } from '../../../api/controller/test/testCategory.service';
import { TBTestCategoryDtoListCustomApiObjResponse } from '../../../api/models/tBTestCategoryDtoListCustomApiObjResponse';
import { ListTestInfoRes, TestInfo } from "../../../../../../app-admin/src/app/modules/test/test-info";
import { TBTestSectionDtoListCustomApiObjResponse } from "../../../api/models/tBTestSectionDtoListCustomApiObjResponse";
import { TestSectionService } from "../../../api/controller/test/testSection.service";
import { TestFeedbackService } from '../../../api/controller/test/testFeedback.service';
import { TBFeedbackCreateDto } from '../../../api/models/tBFeedbackCreateDto';
import { TBFeedbackUpdateDto } from '../../../api/models/tBFeedbackUpdateDto';
import { TBFeedbackDto } from '../../../api/models/tBFeedbackDto';

@Injectable({
  providedIn: 'root',
})
export class AdminTestService {
  constructor(
    private testService: TestService,
    @Inject(LH_API_VERSION) private apiVersion: string,
    private languageService: LhLanguageService,
    private formBuilder: FormBuilder,
    private testCategoryService: TestCategoryService,
    private testSectionService: TestSectionService,
    private testFeedbackService: TestFeedbackService
  ) { }

  public getAllTest(): Observable<ListTestInfoRes> {
    return this.testService.testGetAll(this.apiVersion).pipe(
      mergeMap((testResponse: TBTestDtoListCustomApiObjResponse) => {
        let listTestInfoRes: ListTestInfoRes = {
          errors: testResponse.errors,
          message: testResponse.message,
          statusCode: testResponse.statusCode,
        };
        if (testResponse.isError) {
          return of(listTestInfoRes);
        }
        if (!testResponse.result?.length || testResponse.result?.length == 0) {
          return of(testResponse as ListTestInfoRes);
        }
        return this.getTestInfos(testResponse.result).pipe(
          map((result) => {
            listTestInfoRes.result = result;
            return listTestInfoRes;
          })
        );
      })
    );
  }

  getTestInfos(tests: Array<TBTestDto>): Observable<Array<TestInfo>> {
    let categoryIds: Array<string> = tests
      .map((t) => t.testCategoryId)
      .filter((t) => t !== null && t !== undefined) as Array<string>;

    return this.testCategoryService
      .testCategoryGetByIdsBase(categoryIds.join(','), this.apiVersion)
      .pipe(
        map((result: TBTestCategoryDtoListCustomApiObjResponse) => {
          let categories = result.result;
          return tests.map((t) => {
            return {
              test: t,
              testCategory: categories?.find((c) => c.id === t.testCategoryId),
            } as TestInfo;
          });
        }),
        catchError((error) =>
          of(
            tests.map((t) => {
              return {
                test: t,
              } as TestInfo;
            })
          )
        )
      );
  }

  public addTest(
    testInfo: TBTestCreateDto
  ): Observable<StringCustomApiObjResponse> {
    return this.testService.testAdd(this.apiVersion, testInfo);
  }

  public updateTest(
    test: TBTestUpdateDto
  ): Observable<StringCustomApiObjResponse> {
    return this.testService
      .testUpdate(this.apiVersion, test._id || '', test);
  }

  public countQuestionsInTest(
    test: string
  ): Observable<StringCustomApiObjResponse> {
    return this.testService.testCountQuestionInTest(
      test,
      this.apiVersion
    ) as Observable<StringCustomApiObjResponse>;
  }

  public deleteTest(test: string): Observable<string> {
    return this.testService.testDelete(test, this.apiVersion);
  }

  public deleteBatch(
    test: string[]
  ): Observable<StringListCustomApiObjResponse> {
    return this.testService.testDeletes(this.apiVersion, test);
  }

  public get(
    test: string | null | undefined
  ): Observable<TBTestDtoCustomApiObjResponse> {
    return this.testService.testGet(test || '', this.apiVersion);
  }

  // public getSection(testId: string): Observable<TBTestSectionDtoListCustomApiObjResponse> {
  //   return this.testSectionService.
  // }

  public addTestSectionInTest(
    test: string,
    section: TBSectionConciseDto
  ): Observable<TBTestDtoListCustomApiObjResponse> {
    return this.testService.testAddTestSection(
      test || '',
      this.apiVersion,
      section
    ) as Observable<TBTestDtoListCustomApiObjResponse>;
  }

  public deleteTestSectionInTest(
    test: string,
    section: string[]
  ): Observable<StringListCustomApiObjResponse> {
    return this.testService.testDeleteTestSection(
      test || '',
      this.apiVersion,
      section
    ) as Observable<StringListCustomApiObjResponse>;
  }

  public deleteTestSection(section: string): Observable<string> {
    return this.testSectionService.testSectionDelete(section, this.apiVersion)
  }

  public addQuestionInTest(
    test: string,
    question: TBQuestionDto
  ): Observable<TBTestDtoListCustomApiObjResponse> {
    return this.testService.testAddQuestionToTest(
      test || '',
      this.apiVersion,
      question
    ) as Observable<TBTestDtoListCustomApiObjResponse>;
  }

  public deleteQuestionInTest(
    test: string,
    question: string[]
  ): Observable<StringListCustomApiObjResponse> {
    return this.testService.testDeleteMutipleQuestionFromTest(
      test || '',
      this.apiVersion,
      question
    ) as Observable<StringListCustomApiObjResponse>;
  }

  public getAll(
  ): Observable<TBTestDtoListCustomApiObjResponse> {
    return this.testService.testGetAll(
      this.apiVersion
    ) as Observable<TBTestDtoListCustomApiObjResponse>;
  }

  public verifyTest(
    id: string,
    verify: boolean
  ): Observable<StringCustomApiObjResponse> {
    return this.testService.testUpdateVerify(
      id || '',
      this.apiVersion,
      verify
    ) as Observable<StringCustomApiObjResponse>;
  }

  public buildTestForm(test?: TestInfo): FormGroupTest {
    let form = this.formBuilder.group({
      id: ['' || test?.test?.id],
      slug: ['' || test?.test?.slug],
      testCategoryId: ['' || test?.test?.testCategoryId],
      name: [test?.test?.name, [Validators.maxLength(200)]],
      usedState: [test?.test?.usedState],
      orders: [test?.test?.orders],
      classId: [test?.test?.classId, [Validators.maxLength(200)]],
      code: [test?.test?.code, [Validators.maxLength(200)]],
      testType: [test?.test?.testType],
      isOpen: [test?.test?.isOpen],
      testquestions: [test?.test?.questions],
      questions: [test?.test?.questions],
      duration: [test?.test?.duration],
      passMark: [test?.test?.passMark],
      sumMark: [test?.test?.sumMark],
      countQuestions: [test?.test?.countQuestions],
      rules: [test?.test?.rules, [Validators.maxLength(200)]],
      testComplexity: [test?.test?.testComplexity],
      markDisplay: [test?.test?.markDisplay],
      feedbackDisplay: [test?.test?.feedbackDisplay],
      numberOfReset: [test?.test?.numberOfReset],
      numberOfListenAgain: [test?.test?.numberOfListenAgain],
      markExamType: [test?.test?.markExamType],
      checkAnswersDisplay: [test?.test?.checkAnswersDisplay],
      answersDisplay: [test?.test?.answersDisplay],
      resultDisplay: [test?.test?.resultDisplay],
      shuffleQuestions: [test?.test?.shuffleQuestions],
      shuffleAnswers: [test?.test?.shuffleAnswers],
      questionsPerPage: [test?.test?.questionsPerPage],
      openTime: [test?.test?.openTime],
      closeTime: [test?.test?.name],
      startHour: [test?.test?.name],
      endHour: [test?.test?.name],
      urlImage: [test?.test?.urlImage],
      password: [test?.test?.name, [Validators.maxLength(200)]],
      timeLimitAction: [test?.test?.name],
      autoSave: [test?.test?.name],
      gradeMethod: [test?.test?.gradeMethod],
      attemptAllowed: [test?.test?.attemptAllowed],
      regulation: [test?.test?.regulation, [Validators.maxLength(200)]],
      isVerify: [test?.test?.isVerify],
      description: [test?.test?.description, [Validators.maxLength(500)]],
    }) as unknown as FormGroupTest;

    return form;
  }

  public buildSectionInTestForm(
    section?: TBSectionConciseDto
  ): FormGroupSectionInTest {
    let form2 = this.formBuilder.group({
      id: ['' || section?._id],
      name: [section?.name, [Validators.maxLength(200)]],
      index: [section?.index],
      sumScores: [section?.sumScores],
      duration: [section?.duration],
      numQuestion: [section?.numQuestion],
      plusMark: [section?.plusMark],
      isRequire: [section?.isRequire],
      usedState: [section?.usedState],
      orders: [section?.orders],
    }) as unknown as FormGroupSectionInTest;

    return form2;
  }

  public buildQuestionInTestForm(
    question?: TBQuestionDto
  ): FormGroupQuestionInTest {
    let form3 = this.formBuilder.group({
      _id: ['' || question?._id],
      name: [question?.name, [Validators.maxLength(200)]],
      index: [question?.index],
      sectionId: [question?.sectionId],
      plusMark: [question?.plusMark],
      minusMark: [question?.minusMark],
      questionComplexity: [question?.questionComplexity],
      questionType: [question?.questionType],
    }) as unknown as FormGroupSectionInTest;

    return form3;
  }

  public buildTestFeedbackForm(
    feedback?: TBFeedbackDto
  ): FormGroupFeedBack {
    let form4 = this.formBuilder.group({
      employeeId: ['' || feedback?.employeeId],
      content: ['' || feedback?.employeeId],
      timeStamp: ['' || feedback?.employeeId],
      state: ['' || feedback?.employeeId]
    }) as unknown as FormGroupFeedBack;
    return form4;
  }
}
