import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SysTenantDto} from "../../api";
import {AdminUserService} from "../../modules/admin/admin-user/admin-user.service";

@Component({
  selector: 'lib-choose-tenant',
  templateUrl: './choose-tenant.component.html',
  styleUrls: ['./choose-tenant.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ChooseTenantComponent),
    multi: true
  }]
})
export class ChooseTenantComponent implements ControlValueAccessor, OnInit {
  // loading = false;
  tenantId?: string;
  tenants?: Array<SysTenantDto> = [];

  constructor(private adminUserService: AdminUserService) {

  }

  ngOnInit(): void {
    this.getAllTenant();
  }


  getAllTenant() {
    this.adminUserService.getAllTenant().subscribe((res) => {
      this.tenants = res.result as SysTenantDto[];
    })
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.tenantId = value;
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
