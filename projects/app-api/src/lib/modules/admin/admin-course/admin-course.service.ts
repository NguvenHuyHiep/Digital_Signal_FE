import {Inject, Injectable} from '@angular/core';
import {
  CBChapterAddDto,
  CBChapterUpdateDto,

  CBCourseAddDto,

  CBCourseDto,

  CBCourseUpdateDto,
  CBLessonAddDto,
  CBLessonUpdateDto,
  ChapterService,
  ClassService,
  CourseCategoryService,
  CourseService,
  EmployeeService,
  JobPositionService,
  LessonService, StringCustomApiObjResponse, StringShortEntity,
} from "../../../api";
import {LH_API_VERSION} from "../../../../public-api";
import {catchError, map, mergeMap, Observable, of} from "rxjs";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {
  FormGroupChapter,
  FormGroupCourse,
  FormGroupLesson, FormGroupOption,
  FormGroupTranslationItem
} from "../../../../../../app-admin/src/app/modules/courses/components/course/course-type";
import {LhLanguageService} from "../../language/lh-language.service";
import {CBChapterDtoApiResponse} from '../../../api/models/cBChapterDtoApiResponse';
import {CBLessonDtoApiResponse} from "../../../api/models/cBLessonDtoApiResponse";
import {CBCourseDtoApiResponse} from '../../../api/models/cBCourseDtoApiResponse';
import {CBChapterDto} from "../../../api/models/cBChapterDto";
import {CBLessonDto} from "../../../api/models/cBLessonDto";
import {CBCourseDtoListApiResponse} from "../../../api/models/cBCourseDtoListApiResponse";
import {CBChapterDtoListCustomApiObjResponse} from "../../../api/models/cBChapterDtoListCustomApiObjResponse";
import {CBLessonDtoListCustomApiObjResponse} from "../../../api/models/cBLessonDtoListCustomApiObjResponse";
import {
  CourseInfo,
  ListCourseInfoRes
} from "../../../../../../app-admin/src/app/modules/courses/components/course/course-add/course-info";
import {SysEmployeeDtoListCustomApiObjResponse} from "../../../api/models/sysEmployeeDtoListCustomApiObjResponse";
import {
  buildFormGroupStringShortEntity,
  FormGroupStringShortEntity
} from "../../../../../../app-admin/src/app/modules/base-type";
import {CBCourseDtoIListCustomApiObjResponse} from "../../../api/models/cBCourseDtoIListCustomApiObjResponse";
import {CBClassDtoIListCustomApiObjResponse} from "../../../api/models/cBClassDtoIListCustomApiObjResponse";
import {
  CBCourseCategoryDtoIListCustomApiObjResponse
} from "../../../api/models/cBCourseCategoryDtoIListCustomApiObjResponse";

@Injectable()
export class AdminCourseService {

  constructor(private courseService: CourseService
    , @Inject(LH_API_VERSION) private apiVersion: string
    , private languageService: LhLanguageService
    , private chapterService: ChapterService
    , private lessonService: LessonService
    , private formBuilder: FormBuilder
    , private classService: ClassService
    , private jobPositionService: JobPositionService
    , private employeeService: EmployeeService
    , private courseCategoryService: CourseCategoryService) {
  }

  public addCourse(course: CBCourseAddDto): Observable<StringCustomApiObjResponse> {
    return this.courseService.courseAdd(this.apiVersion, course);
  }

  public updateCourse(course: CBCourseUpdateDto): Observable<StringCustomApiObjResponse> {
    return this.courseService.courseUpdate(course.id || '', this.apiVersion
      , course);
  }

  public addChapter(course: CBChapterAddDto): Observable<CBChapterDtoApiResponse> {
    return this.chapterService.chapterAdd(this.apiVersion, course);
  }

  public updateChapter(course: CBChapterUpdateDto): Observable<CBChapterDtoApiResponse> {
    return this.chapterService.chapterUpdate(course.id || '', this.apiVersion
      , course) as Observable<CBChapterDtoApiResponse>;
  }

  public addLesson(course: CBLessonAddDto): Observable<CBLessonDtoApiResponse> {
    return this.lessonService.lessonAdd(this.apiVersion, course);
  }

  public updateLesson(course: CBLessonUpdateDto): Observable<CBLessonDtoApiResponse> {
    return this.lessonService.lessonUpdate(course.id || '', this.apiVersion
      , course) as Observable<CBChapterDtoApiResponse>;
  }

  public buildCourseForm(course?: CourseInfo): FormGroupCourse {
    let form = this.formBuilder.group({
      id: [course?.course?.id || ''],
      name: [course?.course?.name, [Validators.maxLength(200)]],
      description: [course?.course?.description, [Validators.maxLength(500)]],
      registerCode: [course?.course?.registerCode || '', [Validators.maxLength(50)]],
      startDate: [course?.course?.startDate ? new Date(course?.course?.startDate) : new Date()],
      endDate: [course?.course?.endDate ? new Date(course?.course?.endDate) : new Date(2025, 11, 31)],
      avatarUrl: [course?.course?.avatarUrl],
      wallpaper: [course?.course?.wallpaper],
      usedState: [course?.course?.usedState],
      keyWords: [course?.course?.keyWords],
      version: [course?.course?.version],
      price: [course?.course?.price],
      courseCategory: buildFormGroupStringShortEntity(course?.course?.courseCategory as StringShortEntity),
      paymentMethod: buildFormGroupStringShortEntity(course?.course?.paymentMethod as StringShortEntity),
      certificateType: buildFormGroupStringShortEntity(course?.course?.certificateType as StringShortEntity),
      level: buildFormGroupStringShortEntity(course?.course?.level as StringShortEntity),
      expectedDuration: [course?.course?.expectedDuration],
      courseDuration: [course?.course?.courseDuration]
    }) as FormGroupCourse;

    form.addControl('translation', this.formBuilder.array([]) as FormArray);
    this.languageService.supportLangs.forEach(lang => {
      let tran = course?.course?.translation?.find(tran => tran.language == lang.value);
      const languageForm: FormGroupTranslationItem = this.formBuilder.group({
        name: [tran?.name, [Validators.maxLength(200)]],
        description: [tran?.description, [Validators.maxLength(500)]],
        language: [lang.value, Validators.required],
        languageLabel: [lang.label]
      }) as FormGroupTranslationItem;
      form.controls.translation?.push(languageForm);
    });


    return form;
  }

  public buildChapterForm(chapter?: CBChapterDto, course?: CBCourseDto): FormGroupChapter {
    let form = this.formBuilder.group({
      id: [chapter?.id || ''],
      courseId: [chapter?.courseId || course?.id || ''],
      name: [chapter?.name, [Validators.maxLength(200)]],
      description: [chapter?.description, [Validators.maxLength(500)]]
    }) as FormGroupChapter;

    form.addControl('translation', this.formBuilder.array([]) as FormArray);
    this.languageService.supportLangs.forEach(lang => {
      let tran = chapter?.translation?.find(tran => tran.language == lang.value);
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

  public buildLessonForm(lesson?: CBLessonDto, chapter?: CBChapterDto, course?: CBCourseDto): FormGroupLesson {
    let form = this.formBuilder.group({
      id: [lesson?.id || ''],
      courseId: [lesson?.courseId || chapter?.courseId || course?.id || ''],
      chapterId: [lesson?.chapterId || chapter?.id || ''],
      path: [lesson?.path],
      contentType: [lesson?.contentType],
      name: [chapter?.name, [Validators.maxLength(200)]],
      description: [chapter?.description, [Validators.maxLength(500)]]
    }) as FormGroupLesson;

    form.addControl('translation', this.formBuilder.array([]) as FormArray);
    this.languageService.supportLangs.forEach(lang => {
      let tran = chapter?.translation?.find(tran => tran.language == lang.value);
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
  public getAllRawCourse(): Observable<CBCourseDtoIListCustomApiObjResponse> {
    return this.courseService.courseGetAll(this.apiVersion);
  }
  public getAllCourse(): Observable<ListCourseInfoRes> {
    return this.courseService.courseGetAll(this.apiVersion).pipe(
      mergeMap((courseResponse: CBCourseDtoIListCustomApiObjResponse) => {
        let listCourseInfoRes: ListCourseInfoRes = {
          errors: courseResponse.errors,
          message: courseResponse.message,
          statusCode: courseResponse.statusCode,
        };
        if (courseResponse.isError) {
          return of(listCourseInfoRes);
        }
        if (
          !courseResponse.result?.length ||
          courseResponse.result?.length == 0
        ) {
          return of(courseResponse as ListCourseInfoRes);
        }
        return this.getCourseInfos(courseResponse.result).pipe(
          map((result) => {
            listCourseInfoRes.result = result;
            return listCourseInfoRes;
          })
        );
      })
    );
  }

  public deleteBatch(courses: string[]): Observable<CBCourseDtoListApiResponse> {
    return this.courseService.courseDeletesBase(this.apiVersion, courses);
  }

  public delete(course: string): Observable<string> {
    return this.courseService.courseDeleteBase(course, this.apiVersion);
  }

  public deleteChapter(chapter: string): Observable<string> {
    return this.chapterService.chapterDeleteBase(chapter, this.apiVersion);
  }

  public deleteLesson(lesson: string): Observable<string> {
    return this.lessonService.lessonDeleteBase(lesson, this.apiVersion);
  }

  public getChapters(courseId: string): Observable<CBChapterDtoListCustomApiObjResponse> {
    return this.chapterService.getChapterByCourse(this.apiVersion, courseId);
  }

  public getLessons(chapterId: string): Observable<CBLessonDtoListCustomApiObjResponse> {
    return this.lessonService.lessonGetByChapter(this.apiVersion, chapterId);
  }

  public search(
    currentPage?: number,
    pageSize?: number,
    usedState?: number,
    name?: string,
    catId?: string,
    questionType?: number
  ) {

  }

  private getCourseInfos(courses: Array<CourseInfo>): Observable<Array<CourseInfo>> {
    let categoryIds: Array<string> = courses
      .map((t) => t.courseCategory?.id)
      .filter((t) => t !== null && t !== undefined) as Array<string>;



    let clazzIds: Array<string> = courses.map((t) => t.clazz?.id)
      .filter((t) => t !== null && t !== undefined) as Array<string>


    let classGetByIdsObs: Observable<CBClassDtoIListCustomApiObjResponse>
      = this.classService.classGetByIds(clazzIds.join(','), this.apiVersion).pipe(
      catchError(error => of({
        result: []
      }) as Observable<CBClassDtoIListCustomApiObjResponse>)
    );


    return this.courseCategoryService
      .courseCategoryGetByIdsBase(categoryIds.join(','), this.apiVersion)
      .pipe(
        map((result: CBCourseCategoryDtoIListCustomApiObjResponse) => {
          let categories = result.result;
          return courses.map(q => {
            return {
              course: q
              , courseCategory: categories?.find(c => c.id === q.courseCategory?.id)
            } as CourseInfo;
          });
        }),
        catchError(
          (error) =>
            of(courses.map(q => {
              return {
                course: q
              } as CourseInfo;
            }))
        )
      );
  }
}
