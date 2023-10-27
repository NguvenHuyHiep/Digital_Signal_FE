import {Inject, Injectable} from '@angular/core';
import {
  ChapterService,
  ClassService,
  CourseCategoryService,
  CourseService,
  CustomApiResponse,
  LessonService,
  SearchCourseRequest,
} from '../../../api';
import {LH_API_VERSION} from '../../../../public-api';
import {mergeMap, Observable} from 'rxjs';
import {CBCourseCategoryDtoListApiResponse} from "../../../api/models/cBCourseCategoryDtoListApiResponse";
import {CBCourseDtoListApiResponse} from '../../../api/models/cBCourseDtoListApiResponse';
import {CBCourseDtoApiResponse} from "../../../api/models/cBCourseDtoApiResponse";
import {StringShortEntityListApiResponse} from "../../../api/models/stringShortEntityListApiResponse";
import {CBChapterDtoListCustomApiObjResponse} from "../../../api/models/cBChapterDtoListCustomApiObjResponse";
import {CbMyClassDtoListCustomApiObjResponse} from "../../../api/models/cbMyClassDtoListCustomApiObjResponse";
import {CBCourseCategoryDtoCustomApiObjResponse} from "../../../api/models/cBCourseCategoryDtoCustomApiObjResponse";

@Injectable()
export class LearnerCourseService {
  constructor(
    private courseService: CourseService,
    private classService: ClassService,
    private chapterService: ChapterService,
    private lessonService: LessonService,
    private categoryService: CourseCategoryService,
    @Inject(LH_API_VERSION) private apiVersion: string
  ) {
  }

  public getAll(): Observable<CBCourseDtoListApiResponse> {
    return this.courseService.courseGetAll(this.apiVersion);
  }

  public getRelatedCoures(
    courseId: string
  ): Observable<CBCourseDtoListApiResponse> {
    // TODO correct api later
    return this.courseService.courseGetAll(this.apiVersion);
  }

  public searchCourse(
    searcRequest?: SearchCourseRequest
  ): Observable<CBCourseDtoListApiResponse> {
    return this.courseService.courseSearch(this.apiVersion, searcRequest);
  }


  public myClasses(): Observable<CbMyClassDtoListCustomApiObjResponse> {
    return this.classService.classMyClass(this.apiVersion);
  }


  public getCourseInfoSlug(slug: string): Observable<CBCourseDtoApiResponse> {
    return this.courseService.courseGetBySlugBase(slug, this.apiVersion);
  }

  public complete(): Observable<CBCourseDtoListApiResponse> {
    return this.courseService.courseComplete(this.apiVersion);
  }

  public getChaptersOfCourse(
    courseId?: string
  ): Observable<StringShortEntityListApiResponse> {
    // return this.courseService.courseGetChapter(this.apiVersion, courseId);
    return this.chapterService.chapterGetAll(this.apiVersion);
  }

  public getLessonByChapter(chapterId: string): Observable<CustomApiResponse> {
    return this.lessonService.lessonGetByChapter(this.apiVersion, chapterId);
  }

  public getChapterByCourseId(
    courseId: string
  ): Observable<CBChapterDtoListCustomApiObjResponse> {
    return this.chapterService.getChapterByCourse(this.apiVersion, courseId);
  }

  public getAllCategory(): Observable<CBCourseCategoryDtoListApiResponse> {
    return this.categoryService.courseCategoryGetAll(this.apiVersion);
  }


  public getCategoryById(id: string): Observable<CBCourseCategoryDtoCustomApiObjResponse> {
    return this.categoryService.courseCategoryGet(id, this.apiVersion);
  }

}
