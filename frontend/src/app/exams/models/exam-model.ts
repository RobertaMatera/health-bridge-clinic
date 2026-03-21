import {BaseModel} from '@app/commons/models/base-model';

export interface Exam extends BaseModel{
  analysis: string;
  unitOfMeasure: string;
  examValue: number;
}
