import {Inject, Injectable} from "@angular/core";
import {
  CBCourseAddDto,
  CBCourseCategoryDto, CBCourseCategoryDtoIListCustomApiObjResponse, CBCourseDto,
  CBCourseUpdateDto,
  ChapterService, CourseCategoryService,
} from "../../../api";
import {LH_API_VERSION} from "../../../../public-api";
import {LhLanguageService} from "../../language/lh-language.service";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {
  FormGroupCourse, FormGroupCourseCategory,
  FormGroupTranslationItem
} from "../../../../../../app-admin/src/app/modules/courses/components/course/course-type";
import { CBCourseCategoryDtoApiResponse } from "../../../api/models/cBCourseCategoryDtoApiResponse";
import {CBCourseDtoApiResponse} from "../../../api/models/cBCourseDtoApiResponse";

@Injectable()
export class AdminCourseCategoryService {
  constructor(private categoryService: CourseCategoryService
    , @Inject(LH_API_VERSION) private apiVersion: string
    , private languageService: LhLanguageService
    , private formBuilder: FormBuilder) {
  }


  public add(courseCategory: CBCourseCategoryDto): Observable<CBCourseCategoryDtoApiResponse> {
    return this.categoryService.courseCategoryAdd(this.apiVersion, courseCategory);
  }

  public update(courseCategory: CBCourseCategoryDto): Observable<CBCourseCategoryDtoApiResponse> {
    return this.categoryService.courseCategoryUpdate(courseCategory.id || '', this.apiVersion
      , courseCategory) as Observable<CBCourseDtoApiResponse>;
  }

  public getAllCourseCategory(): Observable<CBCourseCategoryDtoIListCustomApiObjResponse> {
    return this.categoryService.courseCategoryGetAll(this.apiVersion);
  }

  public delete(courseCategory: string): Observable<string> {
    return this.categoryService.courseCategoryDeleteBase(courseCategory, this.apiVersion);
  }

  public deleteBatch(courseCategory: string[]): Observable<CBCourseCategoryDtoApiResponse> {
    return this.categoryService.courseCategoryDeletesBase(this.apiVersion, courseCategory);
  }

  public buildCourseCatagoryForm(courseCategory?: CBCourseCategoryDto): FormGroupCourseCategory {
    let form = this.formBuilder.group({
      id: ['' || courseCategory?.id],
      slug:[''|| courseCategory?.slug],
      name: [courseCategory?.name, [Validators.maxLength(200)]],
      description: [courseCategory?.description, [Validators.maxLength(500)]],
      avatarUrl: [courseCategory?.avatarUrl],
      wallpaper: [courseCategory?.wallpaperUrl]
    }) as  FormGroupCourseCategory

    form.addControl('translation', this.formBuilder.array([]) as FormArray);
    this.languageService.supportLangs.forEach(lang => {
      let tran = courseCategory?.translation?.find(tran => tran.language == lang.value);
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
