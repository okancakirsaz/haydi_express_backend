import {
    Body,
  Controller,
  Delete,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { ChatRoomDto } from 'src/core/dt_objects/chat/chat_room.dto';
import { ChatDto } from 'src/core/dt_objects/chat/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @UseGuards(AuthGuard)
  @Post('create-room')
  async createRoom(@Body() params:ChatRoomDto):Promise<boolean>{
    try {
      return await this.service.createRoom(params);
    } catch (error) {
      throw Error(error);
    }
  }

  @UseGuards(AuthGuard)
  @Post('update-room')
  async update(@Body() params:ChatDto):Promise<boolean>{
    try {
      return await this.service.updateRoom(params);
    } catch (error) {
      throw Error(error);
    }
  }
  
  @UseGuards(AuthGuard)
  @Delete('close-room')
  async closeRoom(@Query('roomId') roomId:string):Promise<boolean>{
  try {
  return await this.service.closeRoom(roomId);
  }
  catch (error) {
  throw Error(error);
  }
  }

}
