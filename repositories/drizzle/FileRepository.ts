import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { files } from '../../db/schema';
import { type IFileCreateInput, type IFileRecord, type IFileRepository } from '../interfaces';

const toRecord = (row: typeof files.$inferSelect): IFileRecord => ({
    id: row.id,
    extension: row.extension ?? null,
    realFileName: row.realFileName ?? null,
    src: row.src ?? null,
    uniqueName: row.uniqueName ?? null,
});

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
        return toRecord(row);
    }

    async findById(id: number): Promise<IFileRecord | null> {
        const [row] = await this.dbRead.select().from(files).where(eq(files.id, id)).limit(1);
        return row ? toRecord(row) : null;
    }

    async deleteById(id: number): Promise<void> {
        await this.dbWrite.delete(files).where(eq(files.id, id));
    }
}
