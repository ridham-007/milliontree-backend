import {
    IsString,
    IsOptional,
    IsBoolean,
    IsMongoId,
  } from 'class-validator';
  
  export class CreateBlogDto {
    @IsMongoId()
    @IsOptional()
    _id?: string;
  
    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    content?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsString()
    slug?: string;
  
    @IsOptional()
    @IsString()
    featureImage?: string;
  
    @IsOptional()
    @IsBoolean()
    status?: boolean;
  }