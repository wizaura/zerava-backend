import { diskStorage } from "multer";
import { extname } from "path";
import { v4 as uuid } from "uuid";

export const galleryMulterConfig = {
    storage: diskStorage({
        destination: "./uploads/gallery",
        filename: (_, file, cb) => {
            cb(null, uuid() + extname(file.originalname));
        },
    }),
};
