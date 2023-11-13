import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {FormGroupUser} from "../../user/components/user-type";
import {Device} from "../../../../../../app-api/src/lib/api/models/device";


export type FormDeviceLog = FormGroup <{
  id?: FormControl<number>,
  date?: FormControl<number>,
  device?: FormDevice
}>

export type FormDevice = FormGroup<{
  id?: FormControl<number>,
  code?: FormControl<string>,
  name?: FormControl<string>,
  information?: FormControl<string>,
  description?: FormControl<string>,
  status?: FormControl<Device.StatusEnum>,
  user?: FormGroupUser,
  deviceGroup?: FormDeviceGroup,
  deviceLogs?: FormArray<FormDeviceLog>,
  deviceId?: FormControl<number>
}>

export type FormDeviceGroup = FormGroup<{
  id?: FormControl<number>,
  name?: FormControl<string>,
  description?: FormControl<string>,
  devices?: FormArray<FormDevice>,
  user?: FormControl<string>
}>
