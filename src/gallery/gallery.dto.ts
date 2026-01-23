export class CreateGalleryDto {
    title: string;
    serviceType: string;
    vehicleType: string;
    description?: string;
    featured?: string;
}

export type GalleryCreateInput = {
    title: string;
    serviceType: string;
    vehicleType: string;
    description?: string;
    featured: boolean;
};
