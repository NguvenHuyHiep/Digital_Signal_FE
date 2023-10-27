import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {WaterMarkService} from "./water-mark.service";


@Component({
  selector: 'app-watermark',
  templateUrl: './watermark.component.html',
  styleUrls: ['./watermark.component.scss']
})

export class WatermarkComponent implements AfterViewInit {
  @Input() title = ''
  // @ts-ignore
  @ViewChild('watermark', {static: false}) watermark: ElementRef;

  constructor(
    private waterMarkService: WaterMarkService,
    private translate: TranslateService
  ) {
  }

  ngAfterViewInit() {
    this.watermark.nativeElement.style.backgroundImage = `url(${this.waterMarkService.updateWatermarks()})`;
    this.translate.onLangChange.subscribe(value => {
      this.watermark.nativeElement.style.backgroundImage = `url(${this.waterMarkService.updateWatermarks()})`;
    });
    this.waterMarkService.layout.subscribe( () => {
      this.watermark.nativeElement.style.backgroundImage = `url(${this.waterMarkService.updateWatermarks()})`;
    });

    this.waterMarkService.updateWatermark.subscribe( () => {
      this.watermark.nativeElement.style.backgroundImage = `url(${this.waterMarkService.updateWatermarks()})`;
    });
  }
}
