import { Module } from '@nestjs/common';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
@Module({
providers:[ChatService,AuthGuard,ChatGateway],
controllers:[ChatController]
})
export class ChatModule{}