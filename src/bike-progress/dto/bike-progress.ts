
import { IsString, IsNotEmpty,  IsDateString, IsOptional, IsObject } from 'class-validator';
export class CreateBikeProgressDto {

    @IsString()
    @IsNotEmpty()
    userId: string;
    @IsString()
    @IsOptional()
    status: string;
    @IsDateString()
    @IsOptional()
    time?: string;
    @IsOptional()
    location_history: number[][];
    count : number;
    temp: any;
}

export class UpdateBikeProgressDto {

    @IsString()
    @IsNotEmpty()
    userId: string;
    @IsString()
    @IsOptional()
    status?: string;
    @IsDateString()
    @IsOptional()
    time?: string;
    @IsObject()
    @IsOptional()
    location_start: {
        type: string; // Point
        coordinates: number[];
    }
    @IsObject()
    @IsOptional()
    location_finish: {
        type: string; // Point
        coordinates: number[];
    }
}
export class LockBikeProgressDto {

    @IsString()
    @IsNotEmpty()
    userId: string;

}