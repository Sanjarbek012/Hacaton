import { ArrayMaxSize, IsArray, IsIn, IsInt, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class AiAssistDto {
  @IsInt()
  topicId: number;

  @IsIn(['explain', 'steps', 'ask'])
  mode: 'explain' | 'steps' | 'ask';

  /** Simulyatsiyaning hozirgi holati (frontend yuboradi) */
  @IsOptional()
  @IsObject()
  state?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  question?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  history?: { role: 'user' | 'assistant'; content: string }[];
}
