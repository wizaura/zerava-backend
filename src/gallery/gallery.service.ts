import { BadRequestException, Injectable } from "@nestjs/common";
import { GalleryRepository } from "./gallery.repository";
import { CreateGalleryDto } from "./gallery.dto";

@Injectable()
export class GalleryService {
    constructor(private readonly repo: GalleryRepository) { }

    create(
        dto: CreateGalleryDto,
        files: {
            beforeImage?: Express.Multer.File[];
            afterImage?: Express.Multer.File[];
        },
    ) {
        if (!files.beforeImage || !files.afterImage) {
            throw new BadRequestException("Both images required");
        }

        return this.repo.create(
            {
                ...dto,
                featured: dto.featured === "true",
            },
            files.beforeImage[0].filename,
            files.afterImage[0].filename,
        );
    }

    findAll(serviceType?: string) {
        return this.repo.findAll(serviceType);
    }

}
