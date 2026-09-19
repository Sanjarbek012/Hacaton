import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto, RegisterDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.exist({ where: { email } })) {
      throw new ConflictException("Bu email bilan allaqachon ro'yxatdan o'tilgan");
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.save(this.users.create({ fullName: dto.fullName.trim(), email, passwordHash }));
    return this.session(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.users.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri");
    }
    return this.session(user);
  }

  async me(id: number) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');
    return { id: user.id, fullName: user.fullName, email: user.email };
  }

  private async session(user: User) {
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, name: user.fullName });
    return { token, user: { id: user.id, fullName: user.fullName, email: user.email } };
  }
}
