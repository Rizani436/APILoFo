import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBarangTemuanDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  namaBarang: string;

  @IsNotEmpty()
  kategoriBarang: any;

  @IsString()
  @IsNotEmpty()
  tanggalTemuan: string;

  @IsString()
  @IsNotEmpty()
  tempatTemuan: string;

  @IsString()
  @IsNotEmpty()
  kotaKabupaten: string;

  @IsString()
  @IsNotEmpty()
  informasiDetail: string;

  @IsString()
  @IsNotEmpty()
  noHP: string;

  @IsNotEmpty()
  status: any;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}

export class UpdateBarangTemuanDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  namaBarang?: string;

  @IsOptional()
  kategoriBarang?: any;

  @IsString()
  @IsOptional()
  tanggalTemuan?: string;

  @IsString()
  @IsOptional()
  tempatTemuan?: string;

  @IsString()
  @IsOptional()
  kotaKabupaten?: string;

  @IsString()
  @IsOptional()
  informasiDetail?: string;

  @IsString()
  @IsOptional()
  noHP?: string;

  @IsString()
  @IsOptional()
  pictUrl?: string;

  @IsOptional()
  status?: any;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}
