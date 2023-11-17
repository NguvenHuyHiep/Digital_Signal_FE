import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RichTextComponent } from './rich-text.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RichTextComponent],
  imports: [CommonModule, CKEditorModule, FormsModule],
  exports: [RichTextComponent],
})
export class RichTextModule {}
