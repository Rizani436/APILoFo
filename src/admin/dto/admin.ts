import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  namaLengkap: string;

  @IsString()
  @IsNotEmpty()
  noHP: string;

  @IsString()
  @IsNotEmpty()
  pictUrl: string;

}

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  namaLengkap?: string;

  @IsString()
  @IsOptional()
  noHP?: string;

  @IsString()
  @IsOptional()
  pictUrl?: string;
}
