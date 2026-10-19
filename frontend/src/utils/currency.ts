export function formatInr(
    amountInPaise: number,
): string {
    return `₹${(amountInPaise / 100).toFixed(2)}`;
}