import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { files } from '../../db/schema';
import { type IFileCreateInput, type IFileRecord, type IFileRepository } from '../interfaces';

export class FileRepository implements IFileRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async create(input: IFileCreateInput): Promise<IFileRecord> {
        const [row] = await this.dbWrite
            .insert(files)
            .values({
                extension: input.extension,
                realFileName: input.realFileName,
                src: input.src,
                uniqueName: input.uniqueName,
            })
            .returning();
        return row;
    }

    async findById(id: number): Promise<IFileRecord | null> {
        const [row] = await this.dbRead.select().from(files).where(eq(files.id, id)).limit(1);
        return row ?? null;
    }

    async deleteById(id: number): Promise<void> {
        await this.dbWrite.delete(files).where(eq(files.id, id));
    }
}
