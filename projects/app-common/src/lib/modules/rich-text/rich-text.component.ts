import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import CKSource from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'lh-common-rich-text',
  templateUrl: './rich-text.component.html',
  styleUrls: ['./rich-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextComponent),
      multi: true,
    },
  ],
})
export class RichTextComponent implements ControlValueAccessor, OnInit {
  public Editor = CKSource;

  value: string = '';

  constructor() {}

  ngOnInit(): void {}

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.value = value;
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
