import type { ConfirmChannel, ConsumeMessage } from "amqplib";
type RetryConfig = {
    retryRoutingKeys: readonly string[];
    dlqRoutingKey: string;
};
export declare function retryOrMoveToDlq(channel: ConfirmChannel, message: ConsumeMessage, config: RetryConfig): Promise<void>;
export declare function moveToDlq(channel: ConfirmChannel, message: ConsumeMessage, dlqRoutingKey: string): Promise<void>;
export {};
//# sourceMappingURL=rabbitmq.consumer-retry.d.ts.map