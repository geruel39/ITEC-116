import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { createPool, Pool } from "mysql2/promise";

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

    async query<T = any>(sql: string, params?: any[]): Promise<T> {
        const [rows] = await this.pool.query(sql, params);
        return rows as T;
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}