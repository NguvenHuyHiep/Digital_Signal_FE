import {Inject, Injectable} from "@angular/core";
import {
  CBClassDto,
  ClassService,
  CourseService,
  StudentService,
  TeacherService
} from "../../../api";
import {LH_API_VERSION} from "../../../../public-api";
import {LhLanguageService} from "../../language/lh-language.service";
import {Observable} from "rxjs";
import {FormArray, FormBuilder, Validators} from "@angular/forms";
import {
  FormGroupClass,
  FormGroupTranslationItem
} from "../../../../../../app-admin/src/app/modules/classes/components/class/class-type";
import {CBTeacherDtoListCustomApiObjResponse} from "../../../api/models/cBTeacherDtoListCustomApiObjResponse";
import {CBStudentDtoListCustomApiObjResponse} from "../../../api/models/cBStudentDtoListCustomApiObjResponse";
import { CBClassDtoApiResponse } from "../../../api/models/cBClassDtoApiResponse";
import {FormGroupStringShortEntity} from "../../../../../../app-admin/src/app/modules/base-type";
import {CBClassDtoListApiResponse} from "../../../api/models/cBClassDtoListApiResponse";
import {AttendanceType} from "../../../api/models/attendanceType";
import {TrainingMethod} from "../../../api/models/trainingMethod";
import {CBCourseDtoApiResponse} from "../../../api/models/cBCourseDtoApiResponse";
import {CBCourseDtoListApiResponse} from "../../../api/models/cBCourseDtoListApiResponse";


@Injectable()
export class AdminClassService {
  constructor(private classService: ClassService
    , @Inject(LH_API_VERSION) private apiVersion: string
    , private languageService: LhLanguageService
    , private teacherService: TeacherService
    , private studentService: StudentService
    , private courseService: CourseService
    , private formBuilder: FormBuilder ) {
  }

  public add(classAdmin: CBClassDto): Observable<CBClassDtoApiResponse> {
    return this.classService.classAdd(this.apiVersion, classAdmin);
  }

  public getAll(): Observable<CBClassDtoListApiResponse> {
    return this.classService.classGetAll(this.apiVersion);
  }

  public buildClassForm(classAdmin?: CBClassDto): FormGroupClass {
    let form = this.formBuilder.group({
    id: [classAdmin?.id || ''],
    name: [classAdmin?.name, [Validators.maxLength(200)]],
    description: [classAdmin?.description, [Validators.maxLength(999999999999)]],
    code: [classAdmin?.code || '', [Validators.maxLength(50)]],
    finalRegisteredDate: [classAdmin?.finalRegisteredDate ? new Date(classAdmin?.finalRegisteredDate) : new Date()],
    fishedDateLimitation: [classAdmin?.fishedDateLimitation ? new Date(classAdmin?.fishedDateLimitation) : new Date(2025, 11, 31)],
    wallpaperUrl: [classAdmin?.wallpaperUrl],
    usedState: [classAdmin?.usedState],
    orders: [classAdmin?.orders],
    isAllowedRelearn: [classAdmin?.isAllowedRelearn],
    isAllowRegister: [classAdmin?.isAllowRegister],
    isApproved: [classAdmin?.isApproved],
    attendenceType: [String(classAdmin?.attendenceType || AttendanceType.NUMBER_1)],
    trainingMethod: [String(classAdmin?.trainingMethod || TrainingMethod.NUMBER_1)],
    expectedCompletionTime: [classAdmin?.expectedCompletionTime],
    numberOfRegisteredStudentsLimitation: [classAdmin?.numberOfRegisteredStudentsLimitation],
      tenant: this.formBuilder.group({
        id: [classAdmin?.tenant?.id]
        , name: [classAdmin?.tenant?.name]
        , description: [classAdmin?.tenant?.description]
        , slug: [classAdmin?.tenant?.slug]
      }) as FormGroupStringShortEntity
      ,   course: this.formBuilder.group({
        id: [classAdmin?.course?.id]
        , name: [classAdmin?.course?.name]
        , description: [classAdmin?.course?.description]
        , slug: [classAdmin?.course?.slug]
      }) as FormGroupStringShortEntity
  }) as FormGroupClass;

    form.addControl('translation', this.formBuilder.array([]) as FormArray);
    this.languageService.supportLangs.forEach(lang => {
      let tran = classAdmin?.translation?.find(tran => tran.language == lang.value);
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

  public update(classAdmin: CBClassDto): Observable<CBClassDtoApiResponse> {
    return this.classService.classUpdate(classAdmin.id || '', this.apiVersion
      , classAdmin) as Observable<CBCourseDtoApiResponse>;
  }

  public deleteBatch(classesArray: string[]): Observable<CBClassDtoListApiResponse> {
    return this.classService.classDeletesBase(this.apiVersion, classesArray);
  }
  public delete(classes: string): Observable<string> {
    return this.classService.classDeleteBase(classes, this.apiVersion);
  }

  public getTeachers(classId: string): Observable<CBTeacherDtoListCustomApiObjResponse> {
    return this.teacherService.teacherGetTeacherByClassId(this.apiVersion, classId)
  }

  public getStudents(classId: string): Observable<CBStudentDtoListCustomApiObjResponse> {
    return this.studentService.studentGetStudentByClassId(this.apiVersion, classId)
  }

  public getCourses(courseId: string): Observable<CBCourseDtoListApiResponse> {
    return this.courseService.courseGetClassByCourse(this.apiVersion, courseId);
  }
}
