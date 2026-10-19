import { AsyncLocalStorage } from "node:async_hooks";
import type { Logger } from "pino";
interface RequestContext {
    requestId: string;
    logger: Logger;
}
export declare const requestContext: AsyncLocalStorage<RequestContext>;
export declare const getRequestContext: () => RequestContext | undefined;
export {};
//# sourceMappingURL=requestContext.d.ts.map