import { IsInt, IsObject } from 'class-validator';

export class CreateResultDto {
  @IsInt()
  topicId: number;

  @IsObject()
  data: Record<string, unknown>;
}
