import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBarangHilangDto {
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
  tanggalHilang: string;

  @IsString()
  @IsNotEmpty()
  tempatHilang: string;

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

  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;
}

export class UpdateBarangHilangDto {
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
  tanggalHilang?: string;

  @IsString()
  @IsOptional()
  tempatHilang?: string;

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

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  longitude?: number;
}
