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
        })
    }

    async query(sql: string, params?: any[]) {
        const [rows] = await this.pool.query(sql, params);
        return rows;
    }

    async onModuleDestroy() {
        await this.pool.end();
    }
}