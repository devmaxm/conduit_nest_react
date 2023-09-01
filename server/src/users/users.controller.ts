import { Body, Controller, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "@app/users/dto/createUser.dto";
import { UsersService } from "@app/users/users.service";
import { LoginDto } from "@app/users/dto/login.dto";
import { UserResponseInterface } from "@app/users/interfaces/userResponse.interface";
import { ExpressRequestInterface } from "@app/interfaces/expressRequest.interface";
import { User } from "@app/users/decorators/user.decorator";
import { JwtGuard } from "@app/users/guards/jwt.guard";
import { UpdateUserDto } from "@app/users/dto/updateUser.dto";

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {
  }

  @Post("users")
  async register(@Body("user") createUserDto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.usersService.create(createUserDto);
    return this.usersService.getUserResponse(user);
  }

  @Post("users/login")
  async login(@Body("user") loginDto: LoginDto): Promise<UserResponseInterface> {
    const user = await this.usersService.login(loginDto);
    return this.usersService.getUserResponse(user);
  }

  @UseGuards(JwtGuard)
  @Get("user")
  async currentUser(@User() user): Promise<UserResponseInterface> {
    return this.usersService.getUserResponse(user);
  }

  @UseGuards(JwtGuard)
  @Put("user")
  async update(
    @User("id") id: number,
    @Body("user") updateUserDto: UpdateUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.usersService.update(id, updateUserDto);
    return await this.usersService.getUserResponse(user);
  }
}
