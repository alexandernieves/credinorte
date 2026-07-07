import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserRole } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';
import { Branch } from '../entities/branch.entity';
import { RememberToken } from '../entities/remember-token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(RememberToken)
    private readonly rememberTokenRepository: Repository<RememberToken>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, passwordHash: string, rememberMe?: boolean) {
    const user = await this.userRepository.findOne({
      where: { email, isActive: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Get branches for this tenant
    const tenant = await this.tenantRepository.findOne({
      where: { id: user.tenantId },
      relations: { branches: true },
    });

    const branches = tenant ? tenant.branches : [];
    
    // Create payload
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
    };

    // Generate remember token if requested
    let rememberTokenVal: string | null = null;
    if (rememberMe) {
      rememberTokenVal = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiration

      const tokenEntity = this.rememberTokenRepository.create({
        token: rememberTokenVal,
        userId: user.id,
        expiresAt,
      });
      await this.rememberTokenRepository.save(tokenEntity);
    }

    return {
      accessToken: this.jwtService.sign(payload),
      rememberToken: rememberTokenVal,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        tenantName: tenant ? tenant.name : '',
        branches: branches.map((b) => ({ id: b.id, name: b.name })),
      },
    };
  }

  async createBranch(tenantId: string, name: string, address?: string) {
    const branch = this.branchRepository.create({
      name,
      address: address || '',
      tenantId,
    });
    await this.branchRepository.save(branch);

    const branches = await this.branchRepository.find({
      where: { tenantId },
    });
    return {
      success: true,
      branches: branches.map((b) => ({ id: b.id, name: b.name })),
    };
  }

  async rememberEmail(token: string) {
    if (!token) {
      return { email: null };
    }

    const tokenEntity = await this.rememberTokenRepository.findOne({
      where: { token },
      relations: { user: true },
    });

    if (!tokenEntity) {
      return { email: null };
    }

    if (tokenEntity.expiresAt < new Date()) {
      await this.rememberTokenRepository.remove(tokenEntity);
      return { email: null };
    }

    return { email: tokenEntity.user.email };
  }

  async forgetUser(token: string) {
    if (token) {
      await this.rememberTokenRepository.delete({ token });
    }
    return { success: true };
  }
}
