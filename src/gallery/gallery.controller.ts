import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { GalleryService } from "./gallery.service";
import { CreateGalleryDto } from "./gallery.dto";
import { galleryMulterConfig } from "src/common/services/multer/multer.config";

@Controller("gallery")
export class GalleryController {
    constructor(private readonly service: GalleryService) { }

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: "beforeImage", maxCount: 1 },
                { name: "afterImage", maxCount: 1 },
            ],
            galleryMulterConfig,
        ),
    )
    create(
        @UploadedFiles()
        files: {
            beforeImage?: Express.Multer.File[];
            afterImage?: Express.Multer.File[];
        },
        @Body() dto: CreateGalleryDto,
    ) {
        return this.service.create(dto, files);
    }


    @Get()
    findAll(@Query("serviceType") serviceType?: string) {
        return this.service.findAll(serviceType);
    }
}
