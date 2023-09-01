import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsString()
  @IsNotEmpty()
  body: string

  @IsOptional()
  @IsArray()
  tagList?: string[]
}