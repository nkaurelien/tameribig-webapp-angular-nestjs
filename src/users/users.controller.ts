import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import type { SessionContainer } from 'supertokens-node/recipe/session';
import { VerifySession, Session, PublicAccess } from 'supertokens-nestjs';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { User, PublicUserProfile } from './interfaces/user.interface.js';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user profile' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Session() session: SessionContainer,
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    const supertokensId = session.getUserId();
    return this.usersService.create(supertokensId, createUserDto);
  }

  @Get()
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get('me')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMe(@Session() session: SessionContainer): Promise<User> {
    const supertokensId = session.getUserId();
    const user = await this.usersService.findBySupertokensId(supertokensId);

    if (!user) {
      const email = this.getEmailFromSession(session);
      return this.usersService.findOrCreateBySupertokensId(
        supertokensId,
        email,
      );
    }

    return user;
  }

  @Get('public/:id')
  @PublicAccess()
  @ApiOperation({ summary: 'Get public user profile by ID or username' })
  @ApiParam({ name: 'id', description: 'User ID or username' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findPublicOne(
    @Param('id') id: string,
  ): Promise<PublicUserProfile | null> {
    const user = await this.usersService.findByUsernameOrId(id);
    if (!user) return null;
    return this.usersService.toPublicProfile(user);
  }

  @Get(':id')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID or username' })
  @ApiParam({ name: 'id', description: 'User ID or username' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.usersService.findByUsernameOrId(id);
  }

  @Put('me')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateMe(
    @Session() session: SessionContainer,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const supertokensId = session.getUserId();
    return this.usersService.updateBySupertokensId(
      supertokensId,
      updateUserDto,
    );
  }

  @Put(':id')
  @VerifySession()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Session() session: SessionContainer,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const supertokensId = session.getUserId();
    const user = await this.usersService.findById(id);

    if (user.supertokensId !== supertokensId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @VerifySession()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user by ID (soft delete)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your profile' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(
    @Session() session: SessionContainer,
    @Param('id') id: string,
  ): Promise<void> {
    const supertokensId = session.getUserId();
    const user = await this.usersService.findById(id);

    if (user.supertokensId !== supertokensId) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    await this.usersService.softDelete(id);
  }

  private getEmailFromSession(session: SessionContainer): string {
    const payload = session.getAccessTokenPayload() as Record<string, unknown>;
    return (payload['email'] as string) || 'unknown@example.com';
  }
}
