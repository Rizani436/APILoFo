import { IsString, IsOptional } from 'class-validator';

export class updateAdmin {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    role?: string;
}