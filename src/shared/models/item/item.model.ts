import { FileModel } from '../shared/file.model';

export class ItemModel {
    id: number;
    uId: string;
    title: string;
    description: string;
    files: Array<FileModel>;
    dateCreated: string;
    views: number;
    commentCount: number;
    favouriteCount: number;
    subscriptionCount: number;
}
