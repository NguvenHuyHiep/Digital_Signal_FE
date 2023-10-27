import {Inject, Injectable} from '@angular/core';
import {
  QBQuestionCategoryDto, QBQuestionCategoryDtoListCustomApiObjResponse, QBQuestionDto,
  QuestionCategoryService, StringCustomApiObjResponse
} from "../../../api";
import {LH_API_VERSION} from "../../../../public-api";
import {LhLanguageService} from "../../language/lh-language.service";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {
   FormGroupQuestionCategory,
  FormGroupTranslationItem
} from "../../../../../../app-admin/src/app/modules/courses/components/course/course-type";

@Injectable({
  providedIn: 'root'
})
export class AdminQuestionCategoryService {

  constructor(private categoryService: QuestionCategoryService
    , @Inject(LH_API_VERSION) private apiVersion: string
    , private languageService: LhLanguageService
    , private formBuilder: FormBuilder) { }

  public add(questionCategory: QBQuestionCategoryDto): Observable<StringCustomApiObjResponse> {
    return this.categoryService.questionCategoryAdd(this.apiVersion, questionCategory);
  }

  public update(questionCategory: QBQuestionCategoryDto): Observable<StringCustomApiObjResponse> {
    return this.categoryService.questionCategoryUpdate(questionCategory.id || '', this.apiVersion
      , questionCategory);
  }

  public getAllCategory(): Observable<QBQuestionCategoryDtoListCustomApiObjResponse> {
    return this.categoryService.questionCategoryGetAll(this.apiVersion);
  }

  public delete(questionCategory: string): Observable<string> {
    return this.categoryService.questionCategoryDelete(questionCategory, this.apiVersion);
  }

  public deleteBatch(questionCategory: string[]): Observable<QBQuestionCategoryDtoListCustomApiObjResponse> {
    return this.categoryService.questionCategoryDeletes(this.apiVersion, questionCategory);
  }

  public buildQuestionCatagoryForm(questionCategory?: QBQuestionCategoryDto): FormGroupQuestionCategory {
    let form = this.formBuilder.group({
      parentId: ['' || questionCategory?.id],
      usedState: ['' || questionCategory?.id],
      id: ['' || questionCategory?.id],
      slug: ['' || questionCategory?.slug],
      name: [questionCategory?.name, [Validators.maxLength(200)]],
      urlImage: [questionCategory?.urlImage],
      orders: [questionCategory?.orders],
      description: [questionCategory?.description, [Validators.maxLength(500)]],
    }) as unknown as  FormGroupQuestionCategory

    form.addControl('translation', this.formBuilder.array([]) as FormArray);
    this.languageService.supportLangs.forEach(lang => {
      let tran = questionCategory?.translation?.find(tran => tran.language == lang.value);
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
