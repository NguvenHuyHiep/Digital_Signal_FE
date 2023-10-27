import {Inject, Injectable} from '@angular/core';
import {
  CBClassDto,
  CBClassDtoCustomApiObjResponse,
  CBClassDtoIListCustomApiObjResponse,
  CBTeacherDto,
  CBTeacherDtoIListCustomApiObjResponse,
  ClassService,
  CustomApiResponse,
  JobPositionService,
  JobTitleService,
  StudentService,
  SysEmployeeDto,
  SysJobPositionDto,
  SysJobTitleDto,
  SysTenantDto,
  TeacherService,
  TenantService,
  TitleService,
} from '../../../api';
import {LH_API_VERSION} from '../../../../public-api';
import {LhLanguageService} from '../../language/lh-language.service';
import {FormBuilder, Validators} from '@angular/forms';
import {catchError, forkJoin, map, mergeMap, Observable, ObservedValueOf, of} from 'rxjs';
import {CBTeacherDtoListCustomApiObjResponse} from '../../../api/models/cBTeacherDtoListCustomApiObjResponse';
import {
  FormGroupStudent,
  FormGroupTeacher,
  FormGroupUser,
} from '../../../../../../app-admin/src/app/modules/users/components/user/user-type';
import {EmployeeService} from '../../../api/controller/core/employee.service';
import {CBStudentDtoListCustomApiObjResponse} from '../../../api/models/cBStudentDtoListCustomApiObjResponse';
import {CBStudentDto} from "../../../api/models/cBStudentDto";
import {CBStudentDtoApiResponse} from "../../../api/models/cBStudentDtoApiResponse";
import {SysEmployeeDtoListCustomApiObjResponse} from "../../../api/models/sysEmployeeDtoListCustomApiObjResponse";
import {
  ListTeacherInfoRes,
  TeacherInfo,
  TeacherInfoRes
} from "../../../../../../app-admin/src/app/modules/users/components/teachers/components/teacher-add/teacher-info";
import {StringCustomApiObjResponse} from "../../../api/models/stringCustomApiObjResponse";
import {CBClassDtoListApiResponse} from "../../../api/models/cBClassDtoListApiResponse";
import {SysTenantDtoListCustomApiObjResponse} from "../../../api/models/sysTenantDtoListCustomApiObjResponse";
import {SysJobPositionDtoListCustomApiObjResponse} from "../../../api/models/sysJobPositionDtoListCustomApiObjResponse";
import {SysJobTitleDtoListCustomApiObjResponse} from "../../../api/models/sysJobTitleDtoListCustomApiObjResponse";
import {
  ListStudentInfoRes,
  StudentInfo, StudentInfoRes
} from "../../../../../../app-admin/src/app/modules/users/components/students/components/students/student-info";
import {SysEmployeeDtoCustomApiObjResponse} from "../../../api/models/sysEmployeeDtoCustomApiObjResponse";
import {SysTenantDtoCustomApiObjResponse} from "../../../api/models/sysTenantDtoCustomApiObjResponse";
import {SysJobPositionDtoCustomApiObjResponse} from "../../../api/models/sysJobPositionDtoCustomApiObjResponse";
import {SysJobTitleDtoCustomApiObjResponse} from "../../../api/models/sysJobTitleDtoCustomApiObjResponse";
import {SysEmployeeAddResultDto} from "../../../api/models/sysEmployeeAddResultDto";

@Injectable()
export class AdminUserService {
  constructor(
    private userService: EmployeeService,
    @Inject(LH_API_VERSION) private apiVersion: string,
    private languageService: LhLanguageService,
    private teacherService: TeacherService,
    private studentService: StudentService,
    private employeeService: EmployeeService,
    private classService: ClassService,
    private tenantService: TenantService,
    private titleService: TitleService,
    private jobPositionService: JobPositionService,
    private jobTitleService: JobTitleService,
    private formBuilder: FormBuilder
  ) {
  }

  public addStudent(studentInfo: StudentInfo): Observable<StudentInfoRes> {

    let employeeResObs: Observable<StringCustomApiObjResponse> = studentInfo.employee?.id
      ? this.employeeService.employeeControllerUpdate(this.apiVersion, studentInfo.employee)
      : this.employeeService.addAsLearner(this.apiVersion, studentInfo.employee);
    return employeeResObs.pipe(
      mergeMap(employeeRes => {
        let studentInfoRes: StudentInfoRes = {
          errors: employeeRes.errors,
          message: employeeRes.message,
          statusCode: employeeRes.statusCode,
        };

        if (employeeRes.isError || !employeeRes.result) {
          return of(studentInfoRes);
        }

        if (studentInfo.student && studentInfo.employee) {
          // let employeeId = employeeRes.result.replace("CSUUID(\"", "");
          // employeeId = employeeId.replace("\")", "");
          // studentInfo.student.employeeId = employeeId;
          // studentInfo.employee.id = employeeId;
          let employeeId = typeof employeeRes.result === 'object'
          &&  (employeeRes.result as SysEmployeeAddResultDto).employeeId
            ? (employeeRes.result as SysEmployeeAddResultDto).employeeId
            : employeeRes.result as string;
          studentInfo.student.employeeId = employeeId;
          studentInfo.employee.id = employeeId;
        }

        return this.studentService.studentAdd(this.apiVersion, studentInfo.student);
      })
      , map((studentRes: StringCustomApiObjResponse) => {
        let studentInfoRes: StudentInfoRes = {
          errors: studentRes.errors,
          message: studentRes.message,
          statusCode: studentRes.statusCode,
        };

        if (studentInfo.student) {
          studentInfo.student.id = studentRes.result;
        }
        studentInfoRes.result = studentInfo;
        return studentInfoRes;
      })
    );
  }

  public addTeacher(teacherInfo: TeacherInfo): Observable<TeacherInfoRes> {
    let employeeResObs: Observable<StringCustomApiObjResponse> = teacherInfo.employee?.id
      ? this.employeeService.employeeControllerUpdate(this.apiVersion, teacherInfo.employee)
      : this.employeeService.addAsTeacher(this.apiVersion, teacherInfo.employee);
    return employeeResObs.pipe(
      mergeMap(employeeRes => {
        let teacherInfoRes: TeacherInfoRes = {
          errors: employeeRes.errors,
          message: employeeRes.message,
          statusCode: employeeRes.statusCode,
        };

        if (employeeRes.isError || !employeeRes.result) {
          return of(teacherInfoRes);
        }

        if (teacherInfo.teacher && teacherInfo.employee) {
          // let rawEmployeeId = typeof employeeRes.result === 'object'
          //   &&  (employeeRes.result as SysEmployeeAddResultDto).employeeId
          // ? (employeeRes.result as SysEmployeeAddResultDto).employeeId
          //   : employeeRes.result as string;
          // let employeeId = rawEmployeeId.replace("CSUUID(\"", "");
         let employeeId = typeof employeeRes.result === 'object'
          &&  (employeeRes.result as SysEmployeeAddResultDto).employeeId
            ? (employeeRes.result as SysEmployeeAddResultDto).employeeId
            : employeeRes.result as string;
          teacherInfo.teacher.employeeId = employeeId;
          teacherInfo.employee.id = employeeId;
        }
        return this.teacherService.teacherAdd(this.apiVersion, teacherInfo.teacher);
      })
      , map((teacherRes: StringCustomApiObjResponse) => {
        let teacherInfoRes: TeacherInfoRes = {
          errors: teacherRes.errors,
          message: teacherRes.message,
          statusCode: teacherRes.statusCode,
        };

        if (teacherInfo.teacher) {
          teacherInfo.teacher.id = teacherRes.result;
        }
        teacherInfoRes.result = teacherInfo;
        return teacherInfoRes;
      })
    );
  }

  public updateStudent(studentInfo: StudentInfo):Observable<StudentInfoRes> {
    return this.employeeService.employeeControllerUpdate(this.apiVersion, studentInfo.employee).pipe(
      mergeMap(employeeRes => {
        let studentInfoRes: StudentInfoRes = {
          errors: employeeRes.errors,
          message: employeeRes.message,
          statusCode: employeeRes.statusCode,
        };

        if (employeeRes.isError || !employeeRes.result) {
          return of(studentInfoRes);
        }

        if (studentInfo.student && studentInfo.employee) {
          // let employeeId = employeeRes.result.replace("CSUUID(\"", "");
          // employeeId = employeeId.replace("\")", "");
          // studentInfo.student.employeeId = employeeId;
          // studentInfo.employee.id = employeeId;
          let employeeId = typeof employeeRes.result === 'object'
          &&  (employeeRes.result as SysEmployeeAddResultDto).employeeId
            ? (employeeRes.result as SysEmployeeAddResultDto).employeeId
            : employeeRes.result as string;
          studentInfo.student.employeeId = employeeId;
          studentInfo.employee.id = employeeId;
        }
        return this.studentService.studentUpdate(studentInfo.student?.id || '', this.apiVersion, studentInfo.student);
      })
      , map((studentRes: StringCustomApiObjResponse) => {
        let studentInfoRes: StudentInfoRes = {
          errors: studentRes.errors,
          message: studentRes.message,
          statusCode: studentRes.statusCode,
        };

        if (studentInfo.student) {
          studentInfo.student.id = studentRes.result;
        }
        studentInfoRes.result = studentInfo;
        return studentInfoRes;
      })
    );
  }

  public updateTeacher(teacherInfo: TeacherInfo): Observable<TeacherInfoRes> {

    return this.employeeService.employeeControllerUpdate(this.apiVersion, teacherInfo.employee).pipe(
      mergeMap(employeeRes => {
        let teacherInfoRes: TeacherInfoRes = {
          errors: employeeRes.errors,
          message: employeeRes.message,
          statusCode: employeeRes.statusCode,
        };

        if (employeeRes.isError || !employeeRes.result) {
          return of(teacherInfoRes);
        }

        if (teacherInfo.teacher && teacherInfo.employee) {
          // let employeeId = employeeRes.result.replace("CSUUID(\"", "");
          // employeeId = employeeId.replace("\")", "");
          // teacherInfo.teacher.employeeId = employeeId;
          // teacherInfo.employee.id = employeeId;
          let employeeId = typeof employeeRes.result === 'object'
          &&  (employeeRes.result as SysEmployeeAddResultDto).employeeId
            ? (employeeRes.result as SysEmployeeAddResultDto).employeeId
            : employeeRes.result as string;
          teacherInfo.teacher.employeeId = employeeId;
          teacherInfo.employee.id = employeeId;
        }
        return this.teacherService.teacherUpdate(teacherInfo.teacher?.id || '', this.apiVersion, teacherInfo.teacher);
      })
      , map((teacherRes: StringCustomApiObjResponse) => {
        let teacherInfoRes: TeacherInfoRes = {
          errors: teacherRes.errors,
          message: teacherRes.message,
          statusCode: teacherRes.statusCode,
        };

        if (teacherInfo.teacher) {
          teacherInfo.teacher.id = teacherRes.result;
        }
        teacherInfoRes.result = teacherInfo;
        return teacherInfoRes;
      })
    );
  }



  public deleteTeacher(teacher: string): Observable<TeacherInfo> {
    return this.teacherService.teacherDeleteBase(teacher, this.apiVersion)
  }

  public deleteBatchTeacher(teachers: string[]): Observable<CBTeacherDtoListCustomApiObjResponse> {
    return this.teacherService.teacherDeletesBase(this.apiVersion, teachers)
  }

  public getAllStudent(): Observable<ListStudentInfoRes> {
    return this.studentService.studentGetAll(this.apiVersion).pipe(
      mergeMap((studentsResponse: CBStudentDtoListCustomApiObjResponse)=> {
        let listStudentInfoRes: ListStudentInfoRes = {
          errors: studentsResponse.errors,
          message: studentsResponse.message,
          statusCode: studentsResponse.statusCode
        };
        if (studentsResponse.isError) {
          return of(listStudentInfoRes);
        }

        if (!studentsResponse.result?.length || studentsResponse.result?.length == 0) {
          return of(studentsResponse as ListStudentInfoRes);
        }

        return this.getStudentInfos(studentsResponse.result).pipe(map(result => {
          listStudentInfoRes.result = result;
          return listStudentInfoRes;
        }));

        // const studentInfoObservable: Array<Observable<StudentInfo>> = studentsResponse.result.map((student: CBStudentDto) => {
        //   return this.getStudentInfo(student);
        // });
        //
        // return forkJoin(studentInfoObservable).pipe(
        //   map(studentInfoResponses => {
        //     listStudentInfoRes.result = studentInfoResponses;
        //     return listStudentInfoRes;
        //   })
        // );

      })
    );
  }

  public getAllTeacher(): Observable<ListTeacherInfoRes> {
    return this.teacherService.teacherGetAll(this.apiVersion).pipe(
      mergeMap((teachersResponse: CBTeacherDtoIListCustomApiObjResponse) => {
        let listTeacherInfoRes: ListTeacherInfoRes = {
          errors: teachersResponse.errors,
          message: teachersResponse.message,
          statusCode: teachersResponse.statusCode,
        };
        if (teachersResponse.isError) {
          return of(listTeacherInfoRes);
        }

        if (!teachersResponse.result?.length || teachersResponse.result?.length == 0) {
          return of(teachersResponse as ListTeacherInfoRes);
        }

        return this.getTeacherInfos(teachersResponse.result).pipe(map(result => {
          listTeacherInfoRes.result = result;
          return listTeacherInfoRes;
        }));
      })
    );
  }

  public buildTeacherForm(
    teacher?: TeacherInfo,
  ): FormGroupTeacher {
    let form = this.formBuilder.group({
      avatar: [],
      userName: [teacher?.employee?.userName, [Validators.maxLength(200)]],
      name: [teacher?.employee?.name, [Validators.maxLength(200)]],
      code: [teacher?.employee?.code, [Validators.maxLength(200)]],
      dateOfBirth: [teacher?.employee?.dateOfBirth ? new Date(teacher?.employee?.dateOfBirth) : new Date()],
      tenantId: [teacher?.employee?.tenantId],
      email: [teacher?.employee?.email, [Validators.maxLength(200)]],
      workPhone: [teacher?.employee?.workPhone, [Validators.maxLength(200)]],
      bankAccountNumber: [teacher?.employee?.bankAccountNumber],
      contractName: [],
      contractEffectFromDate: [],
      piority: [],
      createdDate: [teacher?.employee?.createdDate ? new Date(teacher?.employee?.createdDate) : new Date],
      fullName: [teacher?.teacher?.fullName, [Validators.maxLength(200)]],
      role: [],
      gender: [teacher?.employee?.gender],
      jobPositionId: [teacher?.employee?.jobPositionId],
      jobTitleId: [teacher?.employee?.jobTitleId],
      learnState: [teacher?.teacher?.learnState],
      certificate: [],
      skype: [],
      salary: [],
      signDate: [],
      toDate: [],
      usedState: [teacher?.employee?.usedState],
      // createdBy: [teacher?.employee?.createdBy],
      id: [teacher?.teacher?.id || ''],
      employeeId: [teacher?.employee?.id],
      slug: [teacher?.teacher?.slug],
      description: [],
      clazz: [teacher?.teacher?.clazz?.id, Validators.required],
      password: [teacher?.employee?.password, Validators.minLength(6)],
      rePassword: [teacher?.employee?.password],
      userId: [teacher?.employee?.userId]
    }) as unknown as FormGroupTeacher;
    return form;
  }

  public getAll(): Observable<SysEmployeeDto> {
    return this.userService.employeeControllerGetAll(this.apiVersion);
  }

  public getEmployeeId(employee: string): Observable<SysEmployeeDto> {
    return this.userService.employeeControllerGet(this.apiVersion, employee);
  }

  getAllEmployee(): Observable<SysEmployeeDtoListCustomApiObjResponse> {
    return this.employeeService.employeeControllerGetAll(this.apiVersion)
  }

  getEmployee(employee: string): Observable<SysEmployeeDto> {
    return this.employeeService.employeeControllerGet(employee, this.apiVersion)
  }

  public buildUserForm(user?: SysEmployeeDto): FormGroupUser {
    let form = this.formBuilder.group({
      createdBy: [user?.createdBy],
      modifiedBy: [user?.modifiedBy],
      createdDate: [user?.createdDate],
      modifiedDate: [user?.modifiedDate],
      id: [user?.id || ''],
      tenantId: [user?.tenantId],
      userName: [user?.userName, [Validators.maxLength(200)]],
      name: [user?.name, [Validators.maxLength(200)]],
      code: [user?.code, [Validators.maxLength(200)]],
      dateOfBirth: [user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date()],
      gender: [user?.gender],
      objectCategoryId: [user?.objectCategoryId],
      titleId: [user?.titleId],
      jobTitleId: [user?.jobTitleId],
      jobPositionId: [user?.jobPositionId],
      jobPluralismId: [user?.jobPluralismId],
      email: [user?.email],
      workPhone: [user?.workPhone],
      homePhone: [user?.homePhone],
      bankAccountNumber: [user?.bankAccountNumber],
      bankAccountName: [user?.bankAccountName],
      bankBranchId: [user?.bankBranchId],
      bankName: [user?.bankName],
      bankBranch: [user?.bankBranch],
      taxCode: [user?.taxCode],
      timekeepingCode: [user?.timekeepingCode],
      isCareerEmployee: [user?.isCareerEmployee],
      internshipDate: [user?.internshipDate],
      probationaryDate: [user?.probationaryDate],
      officialWorkingDate: [user?.officialWorkingDate],
      description: [user?.description],
      usedState: [user?.usedState],
      orders: [user?.orders],
    }) as unknown as FormGroupUser;

    return form;
  }


  public deleteBatch(
    students: string[]
  ): Observable<CBStudentDtoListCustomApiObjResponse> {
    return this.studentService.studentDeletesBase(this.apiVersion, students);
  }

  public delete(student: string): Observable<string> {
    return this.studentService.studentDeleteBase(student, this.apiVersion);
  }

  public buildStudentForm(
    student?: StudentInfo
  ): FormGroupStudent {
    let form = this.formBuilder.group({
      id: [student?.student?.id],
      name: [student?.employee?.name, [Validators.maxLength(200)]],
      fullName: [student?.student?.fullName],
      email: [student?.employee?.email, [Validators.maxLength(200)]],
      clazz: [student?.student?.clazz, Validators.required],
      learnedState: [student?.student?.learnedState],
      registeredDate: [student?.student?.registeredDate],
      userName: [student?.employee?.userName, [Validators.maxLength(200)]],
      code: [student?.employee?.code, [Validators.maxLength(200)]],
      gender: [student?.employee?.gender],
      jobPositionId: [student?.employee?.jobPositionId],
      tenantId: [student?.employee?.tenantId],
      internshipDate: [student?.employee?.internshipDate ? new Date(student.employee.internshipDate) : new Date()],
      officalWorkingDate: [student?.employee?.officialWorkingDate ? new Date(student.employee.officialWorkingDate) : new Date()],
      workPhone: [student?.employee?.workPhone],
      usedState: [student?.employee?.usedState],
      employeeId: [student?.employee?.id],
      password: [student?.employee?.password],
      rePassword: [],
      userId: [student?.employee?.userId],
    }) as unknown as FormGroupStudent;
    return form;
  }
  private getStudentInfo(student: CBStudentDto): Observable<StudentInfo> {

    if (!student.employeeId) {
      return of({
        student: student
      })
    }
    return this.employeeService.employeeControllerGet(student.employeeId, this.apiVersion).pipe(mergeMap((employeeResponse: SysEmployeeDtoCustomApiObjResponse) => {
      let employee = employeeResponse.result;
      if (!employee) {
        return of({
          student: student
        });
      }
      let tenantObs = (employee.tenantId ? this.tenantService.tenantControllerGet(employee.tenantId, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );
      let jobPositionObs = (employee.jobPositionId ? this.jobPositionService.jobPositionControllerGet(employee.jobPositionId, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );
      let jobTitleObs = (employee.jobTitleId ? this.jobTitleService.jobTitleControllerGet(employee.jobTitleId, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );
      let classObs = (student?.clazz?.id ? this.classService.classGet(student?.clazz?.id  , this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );

      return forkJoin(tenantObs, jobPositionObs, jobTitleObs, classObs).pipe(map(results => {
        if (student.clazz) {
          student.clazz.name = (results[3] as CBClassDtoCustomApiObjResponse)?.result?.name;
        }
        return {
          student: student
          , employee: employee
          , tenant: (results[0] as SysTenantDtoCustomApiObjResponse)?.result
          , jobPosition: (results[1] as SysJobPositionDtoCustomApiObjResponse)?.result
          , jobTitle: (results[2] as SysJobTitleDtoCustomApiObjResponse)?.result
        } as StudentInfo;
      }))
    }));
  }

  /**
   * @deprecated Using getTeacherInfos instead
   * @param teacher
   */
  public getTeacherInfo(teacher: CBTeacherDto): Observable<TeacherInfo> {

    if (!teacher.employeeId) {
      return of({
        teacher: teacher
      })
    }
    return this.employeeService.employeeControllerGet(teacher.employeeId, this.apiVersion).pipe(mergeMap((employeeResponse: SysEmployeeDtoCustomApiObjResponse) => {
      let employee = employeeResponse.result;
      if (!employee) {
        return of({
          teacher: teacher
        });
      }
      let tenantObs = (employee.tenantId ? this.tenantService.tenantControllerGet(employee.tenantId, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );
      let jobPositionObs = (employee.jobPositionId ? this.jobPositionService.jobPositionControllerGet(employee.jobPositionId, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );
      let jobTitleObs = (employee.jobTitleId ? this.jobTitleService.jobTitleControllerGet(employee.jobTitleId, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );
      let createdByObs = (employee.createdBy ? this.employeeService.employeeControllerGet(employee.createdBy, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );
      let classObs = (teacher?.clazz?.id ? this.classService.classGet(teacher?.clazz?.id, this.apiVersion) : of(undefined)).pipe(
        catchError(error => of(undefined))
      );

      return forkJoin(tenantObs, jobPositionObs, jobTitleObs, createdByObs, classObs).pipe(map(results => {
        if (teacher.clazz) {
          teacher.clazz.name = (results[4] as CBClassDtoCustomApiObjResponse)?.result?.name;
        }
        return {
          teacher: teacher
          , employee: employee
          , tenant: (results[0] as SysTenantDtoCustomApiObjResponse)?.result
          , jobPosition: (results[1] as SysJobPositionDtoCustomApiObjResponse)?.result
          , jobTitle: (results[2] as SysJobTitleDtoCustomApiObjResponse)?.result
          , createdBy: (results[3] as SysEmployeeDtoCustomApiObjResponse)?.result
        } as TeacherInfo;
      }))
    }));
  }

  getStudentInfos(students: Array<CBStudentDto>): Observable<Array<StudentInfo>> {

    let employeeIds: Array<string> = students.map(t => t.employeeId)
      .filter(t => t !== null && t !== undefined) as Array<string>;

    let clazzIds: Array<string> = students.map(t => t.clazz?.id)
      .filter(t => t !== null && t !== undefined) as Array<string>;

    let employeeGetByIdsObs: Observable<SysEmployeeDtoListCustomApiObjResponse>
      = this.employeeService.employeeControllerGetByIds(this.apiVersion, employeeIds.join(',')).pipe(
      catchError(error => of({
        result: []
      }) as Observable<SysEmployeeDtoListCustomApiObjResponse>)
    );

    let classGetByIdsObs: Observable<CBClassDtoIListCustomApiObjResponse>
      = this.classService.classGetByIds(clazzIds.join(','), this.apiVersion ).pipe(
      catchError(error => of({
        result: []
      }) as Observable<CBClassDtoIListCustomApiObjResponse>)
    );
    let buildStudentInfos: (students: Array<CBStudentDto>
      , employees: Array<SysEmployeeDto>
      , classes: Array<CBClassDto>) => Observable<Array<StudentInfo>> =
      (students, employees, classes) => {

        let tenantIds: Array<string> = employees.map(t => t.tenantId)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let jobPositionIds: Array<string> = employees.map(t => t.jobPositionId)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let jobTitleIds: Array<string> = employees.map(t => t.jobTitleId)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let createdByIds: Array<string> = employees.map(t => t.createdBy)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let tenantObs = (tenantIds.length > 0
          ? this.tenantService.tenantControllerGetByIds(this.apiVersion, tenantIds.join(','))
          : of(undefined)).pipe(
          catchError(error => of(undefined))
        );

        let jobPositionObs = (jobPositionIds.length > 0
          ? this.jobPositionService.jobPositionControllerGetByIds(this.apiVersion, jobPositionIds.join(','))
          : of(undefined)).pipe(
          catchError(error => of(undefined))
        );

        let jobTitleObs = (jobTitleIds.length > 0
          ? this.jobTitleService.jobTitleControllerGetByIds(this.apiVersion, jobTitleIds.join(','))
          : of(undefined)).pipe(
          catchError(error => of(undefined))
        );

        let createdByObs = (createdByIds.length > 0
          ? this.employeeService.employeeControllerGetByIds(this.apiVersion, createdByIds.join(','))
          : of([])).pipe(
          catchError(error => of([]))
        );
        return forkJoin(tenantObs, jobPositionObs, jobTitleObs, createdByObs).pipe(map(results => {
          let tenants = (results[0] as CustomApiResponse)?.result as Array<SysTenantDto> || [];
          let jobPositions = (results[1] as CustomApiResponse)?.result as Array<SysJobPositionDto> || [];
          let createdBys = (results[3] as CustomApiResponse)?.result as Array<SysEmployeeDto> || [];
          return students.map(student => {
            let employee = employees.find(e => e.id === student.employeeId);
            return {
              student: student
              , employee: employee
              , clazz: classes.find(c => c.id === student?.clazz?.id)
              , tenant: tenants.find(t => t.id === employee?.tenantId)
              , jobPosition: jobPositions.find(j => j.id === employee?.jobPositionId)
              , createdBy: createdBys.find(e => e.id === employee?.createdBy)
            } as StudentInfo
          })
        }))
      };
    return forkJoin(employeeGetByIdsObs, classGetByIdsObs).pipe(
      mergeMap(results => {
        let employees: Array<SysEmployeeDto> = results[0].result as Array<SysEmployeeDto>;
        let classes: Array<CBStudentDto> = results[1].result as Array<CBStudentDto>;
        return buildStudentInfos(students, employees, classes);
      })
    )
  }
  getTeacherInfos(teachers: Array<CBTeacherDto>): Observable<Array<TeacherInfo>> {

    let employeeIds: Array<string> = teachers.map(t => t.employeeId)
      .filter(t => t !== null && t !== undefined) as Array<string>;

    let clazzIds: Array<string> = teachers.map(t => t.clazz?.id)
      .filter(t => t !== null && t !== undefined) as Array<string>;

    let employeeGetByIdsObs: Observable<SysEmployeeDtoListCustomApiObjResponse>
      = this.employeeService.employeeControllerGetByIds(this.apiVersion, employeeIds.join(',')).pipe(
      catchError(error => of({
        result: []
      }) as Observable<SysEmployeeDtoListCustomApiObjResponse>)
    );

    let classGetByIdsObs: Observable<CBClassDtoIListCustomApiObjResponse>
      = this.classService.classGetByIds(clazzIds.join(','), this.apiVersion ).pipe(
      catchError(error => of({
        result: []
      }) as Observable<CBClassDtoIListCustomApiObjResponse>)
    );

    let buildTeacherInfos: (teachers: Array<CBTeacherDto>
      , employees: Array<SysEmployeeDto>
      , classes: Array<CBClassDto>) => Observable<Array<TeacherInfo>> =
      (teachers, employees, classes) => {

        let tenantIds: Array<string> = employees.map(t => t.tenantId)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let jobPositionIds: Array<string> = employees.map(t => t.jobPositionId)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let jobTitleIds: Array<string> = employees.map(t => t.jobTitleId)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let createdByIds: Array<string> = employees.map(t => t.createdBy)
          .filter(t => t !== null && t !== undefined) as Array<string>;

        let tenantObs = (tenantIds.length > 0
          ? this.tenantService.tenantControllerGetByIds(this.apiVersion, tenantIds.join(','))
          : of(undefined)).pipe(
          catchError(error => of(undefined))
        );

        let jobPositionObs = (jobPositionIds.length > 0
          ? this.jobPositionService.jobPositionControllerGetByIds(this.apiVersion, jobPositionIds.join(','))
          : of(undefined)).pipe(
          catchError(error => of(undefined))
        );

        let jobTitleObs = (createdByIds.length > 0
          ? this.jobTitleService.jobTitleControllerGetByIds(this.apiVersion, jobTitleIds.join(','))
          : of(undefined)).pipe(
          catchError(error => of(undefined))
        );

        let createdByObs = (createdByIds.length > 0
          ? this.employeeService.employeeControllerGetByIds(this.apiVersion, createdByIds.join(','))
          : of([])).pipe(
          catchError(error => of([]))
        );
        return forkJoin(tenantObs, jobPositionObs, jobTitleObs, createdByObs).pipe(map(results => {
          let tenants = (results[0] as CustomApiResponse)?.result as Array<SysTenantDto> || [];
          let jobPositions = (results[1] as CustomApiResponse)?.result as Array<SysJobPositionDto> || [];
          let jobTitles = (results[2] as CustomApiResponse)?.result as Array<SysJobTitleDto> || [];
          let createdBys = (results[3] as CustomApiResponse)?.result as Array<SysEmployeeDto> || [];
          return teachers.map(teacher => {
            let employee = employees.find(e => e.id === teacher.employeeId);
            return {
              teacher: teacher
              , employee: employee
              , clazz: classes.find(c => c.id === teacher?.clazz?.id)
              , tenant: tenants.find(t => t.id === employee?.tenantId)
              , jobPosition: jobPositions.find(j => j.id === employee?.jobPositionId)
              , jobTitle: jobTitles.find(j => j.id === employee?.jobTitleId)
              , createdBy: createdBys.find(e => e.id === employee?.createdBy)
            } as TeacherInfo
          })
        }))
      };


    return forkJoin(employeeGetByIdsObs, classGetByIdsObs).pipe(
      mergeMap(results => {
        let employees: Array<SysEmployeeDto> = results[0].result as Array<SysEmployeeDto>;
        let classes: Array<CBTeacherDto> = results[1].result as Array<CBTeacherDto>;
        return buildTeacherInfos(teachers, employees, classes);
      })
    )
  }


  getAllClass(): Observable<CBClassDtoListApiResponse> {
    return this.classService.classGetAll(this.apiVersion)
  }

  getAllTenant(): Observable<SysTenantDtoListCustomApiObjResponse> {
    return this.tenantService.tenantControllerGetAll(this.apiVersion)
  }

  getAllJobPosition(): Observable<SysJobPositionDtoListCustomApiObjResponse> {
    return this.jobPositionService.jobPositionControllerGetAll(this.apiVersion)
  }

  getAllTitle(): Observable<SysJobTitleDtoListCustomApiObjResponse> {
    return this.jobTitleService.jobTitleControllerGetAll(this.apiVersion)
  }
}
