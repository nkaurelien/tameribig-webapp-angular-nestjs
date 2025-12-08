import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotificationDataDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  actionUrl?: string;
}

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID of the entity to notify (e.g., user ID)' })
  @IsString()
  notifiableId: string;

  @ApiProperty({ description: 'Type of entity (e.g., "User", "Admin")' })
  @IsString()
  notifiableType: string;

  @ApiProperty({
    description: 'Notification type (e.g., "new_message", "order_update")',
  })
  @IsString()
  notificationType: string;

  @ApiPropertyOptional({ description: 'Notification payload data' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => NotificationDataDto)
  data?: NotificationDataDto;
}
