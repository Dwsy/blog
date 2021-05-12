import { Controller, Get, Param } from '@nestjs/common';
import { Crud } from 'libs/nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ApiTags } from '@nestjs/swagger';
import { Contents } from 'libs/db/models/contents.model';
import {Fields} from "libs/db/models/fields.model";
import {ReturnModelType} from "@typegoose/typegoose";
import {Tag} from "libs/db/models/tag.model";
import {Classification} from "libs/db/models/classification.model";
import {Comments} from "libs/db/models/comments.model";

@Crud({
    model: Contents,
    routes: {

        // update: false,
        // delete: false
    }
})
@Controller('api/contents')
@ApiTags('文章主体')
export class ContentsController {
    constructor(@InjectModel(Contents) private readonly model,
                @InjectModel(Fields) private readonly field: ReturnModelType<typeof Fields>,
                @InjectModel(Tag) private readonly tag: ReturnModelType<typeof Tag>,
                @InjectModel(Classification) private readonly classification: ReturnModelType<typeof Comments>,
                ) { }
        //搜索2021-5-10 21:31:23 挖坑
        @Get('search/s/:s')
        async search(@Param('s') s: string) {

            let reg = new RegExp(s,'i');
            let content = {
                mdText:{$regex:reg}
            };
            let Tag = {
                name:{$regex:reg}
            };
            let classification = {
                name:{$regex:reg}
            };
            let t={
                '*.tag' : {
                    $elemMatch: {
                    name:{$regex:reg}}
                }

            }
            let S_content= await this.model.find(content,'mdText');
        // .find({'tag.name':{$regex:reg}})
        //     let test= await this.field.find({},'tag').populate('tag','name').find(t)
            let S_tag= await this.tag.find(Tag,'name')
            let S_classification= await this.classification.find(classification)

            // find({$or:[{title:{$regex:regexp}},{content:{$regex:regexp}},{author:{$regex:regexp}}]})
            let all = {
                // test,
                S_content,
                S_tag,
                S_classification
            }
            //
            // console.log(test);
            // // [0].tag[0].name
            return all

        }

        //搜索2021-5-10 21:31:23 挖坑
}