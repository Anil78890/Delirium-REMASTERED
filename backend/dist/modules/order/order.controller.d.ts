import type { NextFunction, Request, Response } from "express";
export declare function createOrder(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function getOrderById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function updateOrderStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare const getAdminOrders: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAdminOrderById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare function cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=order.controller.d.ts.map