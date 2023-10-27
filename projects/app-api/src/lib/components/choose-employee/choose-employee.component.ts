import {Component, EventEmitter, forwardRef, OnInit, Output} from '@angular/core';
import {SysEmployeeDto} from "../../api";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {AdminUserService} from "../../modules/admin/admin-user/admin-user.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'lib-choose-employee',
  templateUrl: './choose-employee.component.html',
  styleUrls: ['./choose-employee.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChooseEmployeeComponent),
    multi: true
  }]
})
export class ChooseEmployeeComponent implements ControlValueAccessor, OnInit {
  employeeId?: string;
  employees?: Array<SysEmployeeDto> = [];
  @Output() onDataChange: EventEmitter<SysEmployeeDto> = new EventEmitter<SysEmployeeDto>();
  constructor(private adminUserService: AdminUserService
  , translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.getAllEmployee();
  }


  getAllEmployee() {
    this.adminUserService.getAllEmployee().subscribe((res) => {
      this.employees = res.result as SysEmployeeDto[];
    })
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.employeeId = value;
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

  onChangeData(value: string){
    this.onDataChange.emit(this.employees?.find(e => e.id === value));
    this.onChange(value);
  }
  onTouched() {
    // This will be called when the input is touched (e.g., when it loses focus)
  }


}
