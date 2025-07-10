import 'dotenv/config';

const config = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations',
        },
        // Optional: seeds (for initial data, separate from migrations)
        // seeds: {
        //   directory: './seeds'
        // }
    },

    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations',
            tableName: 'knex_migrations'
        },
    }
};

export default config;