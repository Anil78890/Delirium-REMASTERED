import type { Request, Response } from "express";
export declare function refresh(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function logoutAll(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Starts Google OAuth.
 */
export declare function googleLogin(req: Request, res: Response): void;
/**
 * Handles Google's OAuth callback.
 */
export declare function googleCallback(req: Request, res: Response): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=auth.controller.d.ts.map