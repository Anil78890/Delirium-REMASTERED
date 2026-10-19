import type { RealtimeUser } from "./realtime.user.types.js";
declare module "socket.io" {
    interface SocketData {
        user: RealtimeUser;
    }
}
//# sourceMappingURL=realtime.types.d.ts.map