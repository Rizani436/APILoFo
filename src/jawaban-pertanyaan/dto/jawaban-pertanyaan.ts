import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJawabanPertanyaanDto {
  @IsString()
  @IsNotEmpty()
  idBarangTemuan: string;

  @IsString()
  @IsNotEmpty()
  penanya: string;

  @IsString()
  @IsNotEmpty()
  pertanyaan: string;

  @IsString()
  @IsNotEmpty()
  penjawab: string;

  @IsString()
  @IsNotEmpty()
  jawaban: string;

}

export class UpdateJawabanPertanyaanDto {
  @IsString()
  @IsNotEmpty()
  idBarangTemuan?: string;

  @IsString()
  @IsNotEmpty()
  penanya?: string;

  @IsString()
  @IsNotEmpty()
  pertanyaan?: string;

  @IsString()
  @IsNotEmpty()
  penjawab?: string;

  @IsString()
  @IsNotEmpty()
  jawaban?: string;

}