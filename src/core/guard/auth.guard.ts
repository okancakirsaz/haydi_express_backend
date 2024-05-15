import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtConstants } from '../constants/jwt_constant';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService) {}

    private readonly jwtConstants:JwtConstants = new JwtConstants();
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.jwtConstants.secret
        }
      );
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (authHeader) {
        const [type, token] = authHeader.split(' ');
        if (type.toLowerCase() === 'bearer' && token) {
            return token;
        }
    }
    return undefined;
  }


}