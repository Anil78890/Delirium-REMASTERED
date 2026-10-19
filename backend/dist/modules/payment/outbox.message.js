export function serializeOutboxPayload(payload) {
    return Buffer.from(JSON.stringify(payload), "utf-8");
}
//# sourceMappingURL=outbox.message.js.map