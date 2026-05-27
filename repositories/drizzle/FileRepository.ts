import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { files } from '../../db/schema';
import { type TFileCreateInput, type TFileRecord, type TFileRepository } from '../types';

export class FileRepository implements TFileRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async create(input: TFileCreateInput): Promise<TFileRecord> {
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

    async findById(id: number): Promise<TFileRecord | null> {
        const [row] = await this.dbRead.select().from(files).where(eq(files.id, id)).limit(1);
        return row ?? null;
    }

    async deleteById(id: number): Promise<void> {
        await this.dbWrite.delete(files).where(eq(files.id, id));
    }
}
