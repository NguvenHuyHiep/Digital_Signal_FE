//group-device.interface.ts
import {FormControl} from "@angular/forms";

export interface GroupDevice {
  id: string;
  name: string;
  description: string;
  location: string;
  deviceId: string;
}
