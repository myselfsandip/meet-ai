import {
    pgTable,
    serial,
    text,
    varchar,
    timestamp,
    boolean,
    integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    name: varchar('name', { length: 100 }),
    password: text('password'),
    refreshToken: text('refresh_token'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    // emailVerified: boolean('email_verified').default(false),
    // role: varchar('role', { length: 20 }).default('user'),
});

export const accounts = pgTable('accounts', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    provider: varchar('provider', { length: 50 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).unique(),
    oauthAccessToken: text('access_token'),
    oauthRefreshToken: text('oauth_refresh_token'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
