const BASE_RETRY_DELAY_SECONDS = 5;
export const MAX_OUTBOX_ATTEMPTS = 5;
export function getRetryDelayMs(attempts) {
    return BASE_RETRY_DELAY_SECONDS * 2 ** (attempts - 1) * 1000;
}
//# sourceMappingURL=outbox.retry.js.map