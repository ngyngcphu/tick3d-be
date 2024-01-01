// TODO: Implement estimateDeliveryTime properly
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function estimatedDeliveryTime(_order: { district: string; ward: string; street: string; streetNo: string }): Date {
    const day = new Date(Date.now());
    day.setDate(day.getDay() + 2);
    return day;
}
