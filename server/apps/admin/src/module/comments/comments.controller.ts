import {Body, Controller, Get, Post, Delete, Put, UseGuards, HttpCode} from '@nestjs/common';
import {InjectModel} from 'nestjs-typegoose';
import {ApiBearerAuth, ApiOperation, ApiProperty, ApiTags} from '@nestjs/swagger';
import {Comments} from 'libs/db/models/comments.model';
import {Fields} from 'libs/db/models/fields.model';
import {Contents} from 'libs/db/models/contents.model';
// import { ModelType } from '@typegoose/typegoose/lib/types';
import {prop, ReturnModelType} from '@typegoose/typegoose';
import {Param} from '@nestjs/common';
import {Schema as MongooseSchema, Types} from "mongoose";
import {AuthGuard} from '@nestjs/passport';


// import {md5} from ''


class sendCommentDto {
    @ApiProperty({description: '评论文章id', example: '评论文章id'})
    contentsId: string
    // @ApiProperty({description: 'fieldsId', example: 'fieldsId'})
    // @prop({type: MongooseSchema.Types.ObjectId, ref: Fields})
    // fieldsId: Array<MongooseSchema.Types.ObjectId>
    @ApiProperty({description: '评论所属内容作者id', example: '评论所属内容作者id',})
    authorId: string
    @ApiProperty({description: '评论作者名称', example: 'Dwsy'})
    authorName: string
    @ApiProperty({description: '评论文字', example: '评论内容'})
    text: string
    @ApiProperty({description: '评论者ip地址', example: '233.233.233.233'})
    ip: string
    @ApiProperty({description: '评论者网址', example: 'dwsy.link:88'})
    url: string
    @ApiProperty({description: '评论者邮件（加密）', example: 'md5'})
    MD5email: string
    @ApiProperty({description: '评论者邮件', example: '1@1.c'})
    email: string
    @ApiProperty({
        description: '评论者客户端',
        example:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
    })
    @prop()
    agent: string
    @ApiProperty({description: 'isChild', example: false})
    @prop()
    isChild: boolean;
    @ApiProperty({description: 'childId', example: 'childId'})
    @prop({type: MongooseSchema.Types.ObjectId, ref: Comments})
    childId: Array<MongooseSchema.Types.ObjectId>
    @ApiProperty({description: '父评论id'})
    fatherId: string
}

class sendChildCommentDto {
    @ApiProperty({description: '评论文章id', example: '评论文章id'})
    contentsId: string
    // @ApiProperty({description: 'fieldsId', example: 'fieldsId'})
    // @prop({type: MongooseSchema.Types.ObjectId, ref: Fields})
    // fieldsId: Array<MongooseSchema.Types.ObjectId>
    @ApiProperty({description: '评论所属内容作者id', example: '评论所属内容作者id',})
    authorId: string
    @ApiProperty({description: '评论作者名称', example: 'Dwsy'})
    authorName: string
    @ApiProperty({description: '评论文字', example: '评论内容'})
    text: string
    @ApiProperty({description: '评论者ip地址', example: '233.233.233.233'})
    ip: string
    @ApiProperty({description: '评论者网址', example: 'dwsy.link:88'})
    url: string
    @ApiProperty({description: '评论者邮件（加密）', example: 'md5'})
    MD5email: string
    @ApiProperty({description: '评论者邮件', example: '1@1.c'})
    email: string
    @ApiProperty({
        description: '评论者客户端',
        example:
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
    })
    @prop()
    agent: string
    @ApiProperty({description: 'isChild', example: false})
    @prop()
    isChild: boolean;
    @ApiProperty({description: 'childId', example: 'childId'})
    @prop({type: MongooseSchema.Types.ObjectId, ref: Comments})
    childId: Array<MongooseSchema.Types.ObjectId>

    @ApiProperty({description: '父评论id'})
    fatherId: string
}

@Controller('api/comments')
@ApiTags('评论')
export class CommentsController {
    constructor(@InjectModel(Comments) private readonly CommentsModel: ReturnModelType<typeof Comments>,
                @InjectModel(Fields) private readonly fieldsModel: ReturnModelType<typeof Fields>,
                @InjectModel(Contents) private readonly contentsModel: ReturnModelType<typeof Fields>) {
    }

    @Get()
    @ApiOperation({summary: '请求all评论'})
    async getComments() {
        // this.CommentsModel.
        // return this.CommentsModel.find().populate('fieldsId', 'title').sort('_id',-1);
        return this.CommentsModel.find().sort({'_id': -1});
    }

    @Get('recently')
    @ApiOperation({summary: '请求最近5条评论'})
    async getRecentlyComments() {
        // this.CommentsModel.
        return this.CommentsModel.find({}, '-email').limit(5).sort({'_id': -1});
    }


    @Post()
    @ApiOperation({summary: '发送评论'})
    async send(@Body() dto: sendCommentDto) {
        // @ts-ignore
        await this.fieldsModel.findByIdAndUpdate((await this.contentsModel.findById(dto.contentsId, 'fieldsId')).fieldsId, {$inc: {"commentsNum": 1}})
        return this.CommentsModel.create(dto);
        // return await this.CommentsModel.create()
    }

    // @Get('test/:id')
    // async test(@Param('id')id:string){
    //     let fieldsId = (await this.contentsModel.findById(id,'fieldsId')).fieldsId
    //     let a = await this.fieldsModel.findByIdAndUpdate(fieldsId,{$inc:{"commentsNum":1}})
    //     console.log(a)
    //     return a
    // }
    @Post('child')
    @ApiOperation({summary: '发送子评论'})
    async sendChild(@Body() dto: sendChildCommentDto) {
        // @ts-ignore
        await this.fieldsModel.findByIdAndUpdate((await this.contentsModel.findById(dto.contentsId, 'fieldsId')).fieldsId, {$inc: {"commentsNum": 1}})
        let a = await this.CommentsModel.create(dto);
        // console.log((await a))
        // console.log((await a)._id)
        // console.log(dto.fatherId);

        return this.CommentsModel.findByIdAndUpdate(dto.fatherId, {$push: {childId: (await a)._id}})
        // return await this.CommentsModel.create()
    }

    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({summary: '修改评论'})
    async put(@Param('id') id: string, @Body() dto: sendChildCommentDto) {
        return this.CommentsModel.findByIdAndUpdate(id, dto)
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        let a = this.CommentsModel.find({contentsId: id, isChild: false}).populate('childId').sort({'_id': -1});
        // return this.CommentsModel.find(contentsId:id);
        return a;
    }

    @Delete(':id/:isChild')
    async del(@Param('id') id: string, @Param('isChild') isChild: String) {
        if (isChild === "true") {
            // @ts-ignore
            await this.fieldsModel.findByIdAndUpdate((await this.contentsModel.findById((await this.CommentsModel.findById(id, 'contentsId')).contentsId, 'fieldsId')).fieldsId, {$inc: {"commentsNum": -1}})
            await this.CommentsModel.findByIdAndDelete(id)
            return HttpCode(200)

        } else {
            // @ts-ignore
            await this.fieldsModel.findByIdAndUpdate((await this.contentsModel.findById((await this.CommentsModel.findById(id, 'contentsId')).contentsId, 'fieldsId')).fieldsId, {$inc: {"commentsNum": -((await this.CommentsModel.findById(id,'childId')).childId).length}})
            await this.CommentsModel.findByIdAndDelete(id)
            await this.CommentsModel.deleteMany({fatherId: id})
            return HttpCode(200)
        }

    }

    // @Post()
    // // @UseGuards(AuthGuard('jwt'))
    // async create(@Body() dto) {
    //   // dto.user = user._id;
    //   return await this.commentModel.create(dto);
    // }
}
