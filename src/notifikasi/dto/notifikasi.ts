import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNotifikasiDTO {
  @IsString()
  @IsNotEmpty()
  idUser: string;

  @IsString()
  @IsNotEmpty()
  idBarangTemuan: string;


  @IsString()
  @IsNotEmpty()
  pesanNotifikasi: string;

  @IsOptional()
  read: any;

}

export class UpdateNotifikasiDTO {
  @IsString()
  @IsOptional()
  idUser?: string;

  @IsString()
  @IsOptional()
  idBarangTemuan?: string;


  @IsString()
  @IsOptional()
  pesanNotifikasi?: string;

  @IsOptional()
  read?: any;

}