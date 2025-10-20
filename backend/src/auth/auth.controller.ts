import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsBoolean, IsEmail, IsOptional, IsString, Length, Matches, MinLength } from 'class-validator';
import { AuthService } from './auth.service';

class RegisterDto {
  @IsString()
  @Length(1, 64)
  firstName!: string;

  @IsString()
  @Length(1, 64)
  lastName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string; // E.164; frontend will validate format

  @IsString()
  @Length(2, 2)
  country!: string; // ISO 3166-1 alpha-2

  @IsString()
  @MinLength(12)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, { message: 'Password must include uppercase, digit, and special character' })
  password!: string;

  @IsBoolean()
  isAdult!: boolean;

  @IsBoolean()
  acceptTerms!: boolean;
}

class LoginDto {
  @IsString()
  identifier!: string; // email or phone

  @IsString()
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      country: dto.country,
      password: dto.password,
      isAdult: dto.isAdult,
      acceptTerms: dto.acceptTerms,
    });
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.identifier, dto.password);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.auth.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Body() body: { refreshToken: string }) {
    // In a real app, you'd extract sessionId from the token
    return { message: 'Logged out successfully' };
  }
}


