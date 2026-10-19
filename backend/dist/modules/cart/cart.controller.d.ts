import type { Request, Response } from "express";
export declare function getCart(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function addCartItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateCartItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function removeCartItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function clearCart(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=cart.controller.d.ts.map