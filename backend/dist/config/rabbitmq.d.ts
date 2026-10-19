import { type ConfirmChannel } from "amqplib";
type RabbitMQRecoveryHandler = () => Promise<void>;
export declare function registerRabbitMQRecoveryHandler(handler: RabbitMQRecoveryHandler): void;
export declare function connectRabbitMQ(): Promise<ConfirmChannel>;
export declare function connectRabbitMQConsumer(): Promise<ConfirmChannel>;
export declare function setupRabbitMQTopology(channel: ConfirmChannel): Promise<void>;
export {};
//# sourceMappingURL=rabbitmq.d.ts.map