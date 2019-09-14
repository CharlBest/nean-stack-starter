export interface FileModel {
    // TODO: uId should not be optional
    uId?: string;
    dateCreated?: Date;
    url: string;
    width?: number;
    height?: number;
    aspectRatio?: number;
    exifOrientation: ExifOrientation;
    rotation?: ImageRotation | null;
}

export enum ImageRotation {
    ninetyDegrees = 90,
    oneHundredAndEightyDegrees = 180,
    twoHundredAndSeventyDegrees = 270
}

export type ExifOrientation = -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
