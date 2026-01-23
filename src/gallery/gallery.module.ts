import { Module } from "@nestjs/common";
import { GalleryController } from "./gallery.controller";
import { GalleryService } from "./gallery.service";
import { GalleryRepository } from "./gallery.repository";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [GalleryController],
    providers: [GalleryService, GalleryRepository],
})
export class GalleryModule { }
