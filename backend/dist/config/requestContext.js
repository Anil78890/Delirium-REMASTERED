import { AsyncLocalStorage } from "node:async_hooks";
export const requestContext = new AsyncLocalStorage();
export const getRequestContext = () => {
    return requestContext.getStore();
};
//# sourceMappingURL=requestContext.js.map