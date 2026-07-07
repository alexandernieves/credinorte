import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: { email: string; passwordHash: string; rememberMe?: boolean }
  ) {
    return this.authService.login(body.email, body.passwordHash, body.rememberMe);
  }

  @Post('remember-email')
  @HttpCode(HttpStatus.OK)
  async rememberEmail(@Body() body: { rememberToken: string }) {
    return this.authService.rememberEmail(body.rememberToken);
  }

  @Post('forget-user')
  @HttpCode(HttpStatus.OK)
  async forgetUser(@Body() body: { rememberToken: string }) {
    return this.authService.forgetUser(body.rememberToken);
  }

  @Post('branch')
  @UseGuards(JwtAuthGuard)
  async createBranch(
    @Request() req,
    @Body() body: { name: string; address?: string }
  ) {
    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admin users can create branches');
    }
    return this.authService.createBranch(req.user.tenantId, body.name, body.address);
  }
}
