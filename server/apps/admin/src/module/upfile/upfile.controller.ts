import { Controller } from '@nestjs/common';
import { Crud } from 'libs/nestjs-mongoose-crud';
import { InjectModel } from 'nestjs-typegoose';
import { ApiTags } from '@nestjs/swagger';
import { UpFile } from 'libs/db/models/upfile.model';

@Crud({
    model: UpFile,

})
@Controller('api/upfile')
@ApiTags('上传文件')
export class UpfileController {
    constructor(@InjectModel(UpFile) private readonly model) { }

}
