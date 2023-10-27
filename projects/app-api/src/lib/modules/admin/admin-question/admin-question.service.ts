import {Inject, Injectable} from '@angular/core';
import {
  QBOptionQuestionDto,
  QBQuestionCategoryDtoIListCustomApiObjResponse,
  QBQuestionCreateDto,
  QBQuestionDto,
  QBQuestionDtoListCustomApiObjResponse,
  QBQuestionUpdateDto,
  QuestionCategoryService,
  QuestionService,
  StringCustomApiObjResponse,
  TenantService,
} from '../../../api';
import {LH_API_VERSION} from '../../../../public-api';
import {LhLanguageService} from '../../language/lh-language.service';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {catchError, map, mergeMap, Observable, of} from 'rxjs';
import {
  FormGroupFeedBack,
  FormGroupOption,
  FormGroupQuestion,
  FormGroupTranslationItem,
} from '../../../../../../app-admin/src/app/modules/courses/components/course/course-type';
import {QBFeedback} from '../../../api/models/qBFeedback';
import {
  ListQuestionInfoRes,
  QuestionInfo,
} from '../../../../../../app-admin/src/app/modules/question/components/question-add/question-info';

@Injectable({
  providedIn: 'root',
})
export class AdminQuestionService {
  private currentTime: Date;

  constructor(
    private questionService: QuestionService,
    @Inject(LH_API_VERSION) private apiVersion: string,
    private languageService: LhLanguageService,
    private formBuilder: FormBuilder,
    private questionCategoryService: QuestionCategoryService,
    private tenantService: TenantService
  ) {
    this.currentTime = new Date();
  }

  public getAllQuestion(): Observable<ListQuestionInfoRes> {
    return this.questionService.questionGetAll(this.apiVersion).pipe(
      mergeMap((questionResponse: QBQuestionDtoListCustomApiObjResponse) => {
        let listQuestionInfoRes: ListQuestionInfoRes = {
          errors: questionResponse.errors,
          message: questionResponse.message,
          statusCode: questionResponse.statusCode,
        };
        if (questionResponse.isError) {
          return of(listQuestionInfoRes);
        }
        if (
          !questionResponse.result?.length ||
          questionResponse.result?.length == 0
        ) {
          return of(questionResponse as ListQuestionInfoRes);
        }
        return this.getQuestionInfos(questionResponse.result).pipe(
          map((result) => {
            listQuestionInfoRes.result = result;
            return listQuestionInfoRes;
          })
        );
      })
    );
  }

  public getTests(testId: string): Observable<ListQuestionInfoRes> {
    return this.questionService.questionGetByTestId(testId, this.apiVersion).pipe(
      mergeMap((questionResponse: QBQuestionDtoListCustomApiObjResponse) => {
        let listQuestionInfoRes: ListQuestionInfoRes = {
          errors: questionResponse.errors,
          message: questionResponse.message,
          statusCode: questionResponse.statusCode,
        };
        if (questionResponse.isError) {
          return of(listQuestionInfoRes);
        }
        if (
          !questionResponse.result?.length ||
          questionResponse.result?.length == 0
        ) {
          return of(questionResponse as ListQuestionInfoRes);
        }
        return this.getQuestionInfos(questionResponse.result).pipe(
          map((result) => {
            listQuestionInfoRes.result = result;
            return listQuestionInfoRes;
          })
        );
      })
    );
  }

  public addQuestion(questionInfo: QBQuestionCreateDto): Observable<StringCustomApiObjResponse> {
    return this.questionService.questionAdd(this.apiVersion, questionInfo);
  }

  public deleteQuestion(question: string): Observable<string> {
    return this.questionService.questionDelete(question, this.apiVersion);
  }

  public deleteBatch(
    question: string[]
  ): Observable<QBQuestionDtoListCustomApiObjResponse> {
    return this.questionService.questionDeletes(this.apiVersion, question);
  }

  public updateQuestion(
    question: QBQuestionUpdateDto
  ): Observable<StringCustomApiObjResponse> {
    return this.questionService
      .questionUpdate(question?.id || '', this.apiVersion, question);
  }

  public search(
    currentPage?: number,
    pageSize?: number,
    usedState?: number,
    name?: string,
    catId?: string,
    questionType?: number
  ): Observable<ListQuestionInfoRes> {
    return this.questionService.questionPaging(
      this.apiVersion,
      currentPage,
      pageSize,
      usedState,
      name,
      catId,
      questionType
    ).pipe(mergeMap((questionsRes: QBQuestionDtoListCustomApiObjResponse) => {
      let questionInfosRes: ListQuestionInfoRes = {
        errors: questionsRes.errors,
        message: questionsRes.message,
        statusCode: questionsRes.statusCode,
      };
      if (questionsRes.isError) {
        return of(questionInfosRes);
      }

      if (
        !questionsRes.result?.length ||
        questionsRes.result?.length == 0
      ) {
        return of(questionsRes as ListQuestionInfoRes);
      }

      return this.getQuestionInfos(questionsRes.result).pipe(
        map((result) => {
          questionInfosRes.result = result;
          return questionInfosRes;
        })
      );
    }));
  }

  public buildQuestionForm(question?: QuestionInfo): FormGroupQuestion {
    let form = this.formBuilder.group({
      urlImage: [''],
      typeViewContent: ['' || question?.question?.typeViewContent],
      id: ['' || question?.question?.id],
      questionCategoryId: ['' || question?.question?.questionCategoryId],
      questionContent: ['' || question?.question?.questionContent],
      plusMark: ['' || question?.question?.plusMark],
      questionComplexity: ['' || question?.question?.questionComplexity],
      typeViewAnswer: ['' || question?.question?.typeViewAnswer],
      usedState: [question?.question?.usedState],
      questionType: ['' || question?.question?.questionType],
      slug: ['' || question?.question?.slug],
      name: [question?.question?.name, [Validators.maxLength(200)]],
      description: [question?.question?.description, [Validators.maxLength(500)]],
      testId: [question?.question?.testId]
    }) as FormGroupQuestion;

    form.addControl(
      'translationQuestion',
      this.formBuilder.array([]) as FormArray
    );
    this.languageService.supportLangs.forEach((lang) => {
      let tran = question?.question?.translation?.find(
        (tran) => tran.language == lang.value
      );
      const languageForm: FormGroupTranslationItem = this.formBuilder.group({
        name: [tran?.name, [Validators.maxLength(200)]],
        description: [tran?.description, [Validators.maxLength(500)]],
        language: [lang.value, Validators.required],
        languageLabel: [lang.label],
      }) as FormGroupTranslationItem;
      form.controls.translationQuestion?.push(languageForm);
    });
    form.addControl('options', this.formBuilder.array([]) as FormArray);
    question?.question?.options?.forEach((opt) => {
      const optionForm: FormGroupOption = this.buildQuestionOption(opt);
      form.controls.options?.push(optionForm);
    });
    form.addControl('feedback', this.formBuilder.array([]) as FormArray);
    question?.question?.feedBack?.forEach((fb) => {
      const fbForm: FormGroupFeedBack = this.buidFeedBackForm(fb);
      form.controls.feedback?.push(fbForm);

    });
    return form;

  }

  public buildQuestionOption(opt?: QBOptionQuestionDto) {
    return this.formBuilder.group({
      index: Number([opt?.index]),
      explain: [opt?.explain],
      content: [opt?.content],
      answer: [opt?.answer],
      urlSpeech: [opt?.urlSpeech],
      textToSpeech: [opt?.textToSpeech],
      isAnswer: [(!opt?.isAnswer || opt?.isAnswer == null) ? false : opt?.isAnswer],
    }) as FormGroupOption;
  }

  public buidFeedBackForm(fb?: QBFeedback) {
    return this.formBuilder.group({
      employeeId: ['' || fb?.employeeId],
      content: [fb?.content],
      timeStamp: [fb?.timeStamp || new Date()],
      state: Number([fb?.state || '']),
    }) as FormGroupFeedBack;
  }

  getQuestionInfos(
    questions: Array<QBQuestionDto>
  ): Observable<Array<QuestionInfo>> {
    let categoryIds: Array<string> = questions
      .map((t) => t.questionCategoryId)
      .filter((t) => t !== null && t !== undefined) as Array<string>;

    return this.questionCategoryService
      .questionCategoryGetByIdsBase(categoryIds.join(','), this.apiVersion)
      .pipe(
        map((result: QBQuestionCategoryDtoIListCustomApiObjResponse) => {
          let categories = result.result;
          return questions.map(q => {
            return {
              question: q
              , questionCategory: categories?.find(c => c.id === q.questionCategoryId)
            } as QuestionInfo;
          });
        }),
        catchError(
          (error) =>
            of(questions.map(q => {
              return {
                question: q
              } as QuestionInfo;
            }))
        )
      );
  }
}
