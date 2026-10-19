import type { Request, Response, NextFunction } from "express";
type UserRole = "CUSTOMER" | "ADMIN";
export declare const requireRole: (requiredRole: UserRole) => (req: Request, _res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=authorization.middleware.d.ts.map