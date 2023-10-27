import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {CBCourseDto} from "../../api";
import {AdminCourseService} from "../../modules/admin/admin-course/admin-course.service";

@Component({
  selector: 'lib-choose-course',
  templateUrl: './choose-course.component.html',
  styleUrls: ['./choose-course.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChooseCourseComponent),
    multi: true
  }]
})
export class ChooseCourseComponent implements ControlValueAccessor, OnInit {
  // loading = false;
  selectedCourse?: string;
  courses?: Array<CBCourseDto> = [];

  constructor(private adminCourseService: AdminCourseService) {

  }

  ngOnInit(): void {
    this.getAllCourse();
  }


  getAllCourse() {
    this.adminCourseService.getAllRawCourse().subscribe((res) => {
      this.courses = res.result as CBCourseDto[];
    })
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.selectedCourse = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement this if you want to support disabling the control
  }

  // Custom methods
  onChange(value: string) {
    // This will be called when the value of the input changes
  }

  onTouched() {
    // This will be called when the input is touched (e.g., when it loses focus)
  }

}
