import { Module } from '@nestjs/common';
import { DbModule } from 'libs/db';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { ContentsModule } from './contents/contents.module';
import { FieldsModule } from './fields/fields.module';
import { SettingoptionsModule } from './settingoptions/settingoptions.module';
import { TagModule } from './tag/tag.module';
import { ClassificationModule } from './classification/classification.module';

@Module({
  imports: [
    ClassificationModule,
    DbModule,
    UsersModule,
    CommentsModule,
    ContentsModule,
    FieldsModule,
    SettingoptionsModule,
    TagModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
