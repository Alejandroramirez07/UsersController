import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { Role } from '../../common/enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.usersRepository.find({ 
      where: { isActive: true } 
    });
    return users.map(user => {
      const { passwordHash, ...safeUser } = user;
      return safeUser;
    });
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async getProfile(id: number): Promise<Partial<User>> {
    return this.findOne(id);
  }

  async findAllStudents(): Promise<Partial<User>[]> {
    return this.usersRepository.find({
      where: { role: Role.Student, isActive: true },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt']
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    if (!createUserDto.password) {
      throw new BadRequestException('Password is required');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      passwordHash: hashedPassword,
    });
    
    const savedUser = await this.usersRepository.save(newUser);
    const { passwordHash, ...safeUser } = savedUser;
    return safeUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (updateUserDto.password) {
      user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateUserDto.password;
    }
    
    this.usersRepository.merge(user, updateUserDto);
    const updatedUser = await this.usersRepository.save(user);
    
    const { passwordHash, ...safeUser } = updatedUser;
    return safeUser;
  }

  async deactivate(id: number): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    
    user.isActive = false;
    await this.usersRepository.save(user);
    
    return { message: 'User deactivated successfully' };
  }

  // Optional: Keep for actual deletion if needed
  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}