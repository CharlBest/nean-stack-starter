import { FileModel } from '../../models/shared/file.model';

export class CreateOrUpdateItemViewModel {
    title: string;
    description: string;
    files: Array<FileModel>;
}
