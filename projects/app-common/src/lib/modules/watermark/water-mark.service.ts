import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {TranslateService} from "@ngx-translate/core";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class WaterMarkService {
  layout = new Subject<any>();
  watermark: string | null = null;
  private watermarkLabel: string = '';
  updateWatermark = new Subject<string>();

  constructor(private translate: TranslateService) {

    this.updateWatermark.subscribe(value => {
      this.watermarkLabel = value;
      this.updateWatermarks();
    })
  }

  changeLayout() {
    this.layout.next(true);
  }

  updateWatermarks(): string | null {
    this.watermark = null;
    return this.getWatermark();
  }

  getWatermark(): string | null {
    if (!this.watermark) {
      const canvas = document.createElement('canvas');
      canvas.width = 332;
      canvas.height = 332;
      const ctx = canvas.getContext('2d');
      if (ctx && ctx != null) {
        ctx.fillStyle = 'rgba(24,144,255,0.4)';
        ctx.font = '22px Georgia';
        ctx.setTransform(1, -0.4, 0.4, 1, 0, 0);
        ctx.fillText(this.watermarkLabel == ''
          ? this.watermarkLabel
          : this.translate.instant(this.watermarkLabel), 10, 100);
      }

      this.watermark = canvas.toDataURL('image/png');
    }
    return this.watermark;
  }
}
