import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { users, accounts } from '../db/schema';
import { and, eq } from 'drizzle-orm';
import { db } from '../db';



export const configurePassport = () => {

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const existingAccount = await db
                        .select()
                        .from(accounts)
                        .where(
                            and(
                                eq(accounts.providerId, profile.id),
                                eq(accounts.provider, 'google')
                            )
                        )
                        .limit(1);

                    if (existingAccount[0]) {
                        const user = await db
                            .select()
                            .from(users)
                            .where(eq(users.id, existingAccount[0].userId))
                            .limit(1);
                        return done(null, user[0], { accessToken, tokenExpiresIn: profile._json.exp });
                    }

                    const [newUser] = await db
                        .insert(users)
                        .values({
                            email: profile.emails![0].value,
                            name: profile.displayName,
                        })
                        .returning();

                    await db
                        .insert(accounts)
                        .values({
                            userId: newUser.id,
                            provider: 'google',
                            providerId: profile.id,
                            oauthAccessToken: accessToken,
                            oauthRefreshToken: refreshToken || null,
                        });

                    return done(null, newUser, { accessToken, tokenExpiresIn: profile._json.exp });
                } catch (error) {
                    return done(error as Error);
                }
            }
        )
    );

    //If 
    // passport.serializeUser((user: any, done) => {
    //     done(null, user.id);
    // });

    // passport.deserializeUser(async (id: number, done) => {
    //     try {
    //         const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    //         done(null, user[0]);
    //     } catch (error) {
    //         done(error);
    //     }
    // });
};