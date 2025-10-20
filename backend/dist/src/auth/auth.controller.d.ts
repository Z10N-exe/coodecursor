import { AuthService } from './auth.service';
declare class RegisterDto {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    country: string;
    password: string;
    isAdult: boolean;
    acceptTerms: boolean;
}
declare class LoginDto {
    identifier: string;
    password: string;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        message: string;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string | null;
        };
    }>;
    refresh(body: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
    logout(body: {
        refreshToken: string;
    }): Promise<{
        message: string;
    }>;
}
export {};
