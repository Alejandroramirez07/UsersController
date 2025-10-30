import { IsString, IsEmail, MinLength, MaxLength, Matches, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../common/enums/roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' }) // Fixed: 6 → 8
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })     // Fixed: MinLength → MaxLength
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {                             // Added: matches update validation
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role) // Added: enum validation
  role?: Role;
}