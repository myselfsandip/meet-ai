import jwt, { JwtPayload } from "jsonwebtoken";

export const generateAccessToken = (userId: number) => {
    const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET!, { expiresIn: '60m' });
    return accessToken;
};

export const generateRefreshToken = (userId: number) => {
    const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
    return refreshToken;
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
}
export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as JwtPayload;
}
