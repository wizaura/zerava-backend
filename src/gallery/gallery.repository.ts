import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateGalleryDto, GalleryCreateInput } from "./gallery.dto";

@Injectable()
export class GalleryRepository {
    constructor(private readonly prisma: PrismaService) { }

    create(
        dto: GalleryCreateInput,
        beforeImage: string,
        afterImage: string,
    ) {
        return this.prisma.galleryItem.create({
            data: {
                ...dto,
                beforeImage,
                afterImage,
            },
        });
    }

    findAll(serviceType?: string) {
        return this.prisma.galleryItem.findMany({
            where: serviceType
                ? { serviceType }
                : undefined,
            orderBy: { createdAt: "desc" },
        });
    }

}
