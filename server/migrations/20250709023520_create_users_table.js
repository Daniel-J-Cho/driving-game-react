export const up = (knex) => {
    return knex.raw(`
        CREATE TABLE users (
            user_id         serial          NOT NULL,
            username        text            NOT NULL UNIQUE,
            hashed_password text            NOT NULL,
            created_at      timestamptz(6)  NOT NULL default now(),
            CONSTRAINT users_pk PRIMARY KEY (user_id)
        ) WITH (
          OIDS=FALSE
        )
    `);
};

export const down = (knex) => {
    return knex.raw(`
        DROP TABLE users  
    `);
};
