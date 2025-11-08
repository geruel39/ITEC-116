import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createPool, Pool, RowDataPacket, OkPacket, ResultSetHeader } from "mysql2/promise";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool: Pool;

    async onModuleInit() {
        this.pool = createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'act5_blog'
        });
    }

    async query<T extends RowDataPacket[] | OkPacket | ResultSetHeader>(
        sql: string,
        params?: any[]
    ): Promise<T> {
        const [rows] = await this.pool.query<T>(sql, params);
        return rows;
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}