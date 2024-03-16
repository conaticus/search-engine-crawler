import pool from "./pool";

// Ideally this class would execute all commands in one query, but pg prohibits this, in future could use: https://www.npmjs.com/package/pg-promise
export default class QueryBuilder {
    public static async insert(table: string, columns: string[], values: any[]) {
        const parametisedColumns = columns.map((_, idx) => `$${idx + 1}`);

        const query = `INSERT INTO ${table} (${columns.join()}) VALUES (${parametisedColumns.join()})`;
        await pool.query(query, values);
    }

    public static async insertManyOrUpdate(
        table: string,
        columns: string[],
        values: any[][],
        types: string[],
        conflictColumns: string[],
        conflictAction: string
    ) {
        const parametisedColumns = columns.map(
            (_, idx) => `unnest($${idx + 1}::${types[idx]}[]) as ${columns[idx]}`
        );

        const query = `INSERT INTO ${table} (${columns.join()}) SELECT ${parametisedColumns.join()} ON CONFLICT (${conflictColumns.join()}) DO UPDATE SET ${conflictAction}`;

        await pool.query(query, values);
    }

    public static async insertMany(
        table: string,
        columns: string[],
        values: any[][],
        types: string[]
    ) {
        const parametisedColumns = columns.map(
            (_, idx) => `unnest($${idx + 1}::${types[idx]}[]) as ${columns[idx]}`
        );

        const query = `INSERT INTO ${table} (${columns.join()}) SELECT ${parametisedColumns.join()}`;

        pool.query(query, values);
    }
}
