import "./realtime.types.js";
import { Server } from "socket.io";
import type { Server as HttpServer } from "node:http";
export declare function createRealtimeServer(httpServer: HttpServer): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any>;
//# sourceMappingURL=realtime.server.d.ts.map