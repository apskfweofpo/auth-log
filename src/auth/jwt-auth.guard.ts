import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { MyLoggerService } from 'src/my-logger/my-logger.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new MyLoggerService();

  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'User is not authorized',
        });
      }

      const user = this.jwtService.verify(token);
      req.userId = user.id;
      return true;
    } catch (e) {
      this.logger.error(`ValidationExceptions: ${e.message}`);
      throw new UnauthorizedException({
        message: e.message,
      });
    }
  }
}
