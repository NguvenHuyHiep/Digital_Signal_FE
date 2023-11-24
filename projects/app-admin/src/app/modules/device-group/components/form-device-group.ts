import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { FormGroupUser } from '../../user/components/user-type';
import { DeviceStatus } from '@app-api/lib/api/models/deviceStatus';

export type FormDeviceLog = FormGroup<{
  id?: FormControl<number>;
  date?: FormControl<number>;
  device?: FormDevice;
}>;

export type FormDevice = FormGroup<{
  id?: FormControl<number>;
  code?: FormControl<string>;
  name?: FormControl<string>;
  information?: FormControl<string>;
  description?: FormControl<string>;
  status?: FormControl<DeviceStatus>;
  user?: FormGroupUser;
  deviceGroup?: FormDeviceGroup;
  deviceLogs?: FormArray<FormDeviceLog>;
  deviceId?: FormControl<number>;
}>;

export type FormDeviceGroup = FormGroup<{
  id?: FormControl<number>;
  name?: FormControl<string>;
  description?: FormControl<string>;
  devices?: FormArray<FormDevice>;
  user?: FormControl<string>;
}>;
