import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/users/users.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "@app/users/dto/createUser.dto";
import * as jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET_KEY } from "@app/config/env.config";
import { UserResponseInterface } from "@app/users/interfaces/userResponse.interface";
import { LoginDto } from "@app/users/dto/login.dto";

import * as bcrypt from "bcrypt";
import { UpdateUserDto } from "@app/users/dto/updateUser.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByUsername = await this.usersRepository.findOneBy({ username: createUserDto.username });
    if (userByUsername) {
      throw new HttpException("User with this username already exist", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const userByEmail = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (userByEmail) {
      throw new HttpException("User with this email already exist", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    newUser.image = "default_user_avatar.png"
    return await this.usersRepository.save(newUser);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.getById(id)
    Object.assign(user, updateUserDto)
    return await this.usersRepository.save(user)
  }

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
      select: ["id", "username", "email", "bio", "image", "password"]
    });
    if (!user) {
      throw new HttpException("User with this email does not exist", HttpStatus.UNAUTHORIZED);
    }

    const isPasswordCorrect = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException("Password not correct", HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async getById(id: number): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({id})
  }

  getUserResponse(user: UserEntity): UserResponseInterface {
    delete user.password
    return {
      user: {
        ...user,
        token: this.generateJwt(user)
      }
    };
  }

  generateJwt(user: UserEntity): string {
    return jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email
    }, JWT_ACCESS_SECRET_KEY);
  }
}
