import { join } from "path";
import sqlite3, { RunResult } from "sqlite3";
import { existsSync, mkdirSync } from "fs";
import { singleton } from "tsyringe";

@singleton()
export class DbConnectionService {
    private readonly _connection: sqlite3.Database;
    private readonly _run: (sql: string, params?: any[]) => Promise<RunResult>;
    private readonly _all: (sql: string, params?: any[]) => Promise<any[]>;
    private readonly _get: (sql: string, params?: any[]) => Promise<any>;
    private readonly _lastId: () => Promise<number>;

    constructor() {
        this._connection = this.initializeDatabase();
        this._run = this.createRunMethod();
        this._all = this.createAllMethod();
        this._get = this.createGetMethod();
        this._lastId = this.createLastIdMethod();
        this.initializeTables();
    }

    private initializeDatabase(): sqlite3.Database {
        const dbPath = join(process.cwd(), "db/");
        if (!existsSync(dbPath)) {
            mkdirSync(dbPath, { recursive: true });
        }
        return new sqlite3.Database(join(dbPath, "employees.db"));
    }

    private createRunMethod() {
        return (sql: string, params?: any[]) => {
            return new Promise<RunResult>((resolve, reject) => {
                this._connection.run(sql, params, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this);
                    }
                });
            });
        };
    }

    private createLastIdMethod() {
        return () => {
            return new Promise<number>((resolve, reject) => {
                this._connection.get(
                    "SELECT last_insert_rowid() as id",
                    [],
                    function (err, row: any) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(row ? row.id : 0);
                        }
                    }
                );
            });
        };
    }

    private createAllMethod() {
        return (sql: string, params?: any[]) => {
            return new Promise<any[]>((resolve, reject) => {
                this._connection.all(sql, params, function (err, rows) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });
        };
    }

    private createGetMethod() {
        return (sql: string, params?: any[]) => {
            return new Promise<any>((resolve, reject) => {
                this._connection.get(sql, params, function (err, row) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
            });
        };
    }

    private async initializeTables() {
        const query = `
            CREATE TABLE IF NOT EXISTS employees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                address TEXT NOT NULL,
                phoneNumber TEXT NOT NULL,
                dateOfBirth TEXT NOT NULL,
                gender TEXT NOT NULL,
                position TEXT NOT NULL,
                department TEXT NOT NULL,
                hireDate TEXT NOT NULL,
                isActive INTEGER NOT NULL DEFAULT 1,
                createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            create index if not exists idx_employees_position on employees (position);
        `;
        await this._run(query);
    }

    get run() {
        return this._run;
    }

    get all() {
        return this._all;
    }

    get get() {
        return this._get;
    }

    get lastId() {
        return this._lastId;
    }
}
