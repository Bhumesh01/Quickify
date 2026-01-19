import type { Request, Response, NextFunction } from "express";
interface CustomRequest extends Request {
    userId?: string;
}
export default function authMiddleware(req: CustomRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=middleware.d.ts.map