type AccessTokenPayload = {
    sub: string;
    role: "CUSTOMER" | "ADMIN";
};
type RefreshTokenPayload = {
    sub: string;
    jti: string;
};
export declare function generateAccessToken(payload: AccessTokenPayload): string;
export declare function generateRefreshToken(payload: RefreshTokenPayload): string;
export declare function verifyAccessToken(token: string): AccessTokenPayload;
export declare function verifyRefreshToken(token: string): RefreshTokenPayload;
export declare function getTokenExpiration(token: string): Date;
export {};
//# sourceMappingURL=jwt.d.ts.map