export enum SeatStatus {
    AVAILABLE = 'AVAILABLE',
    BOOKED = 'BOOKED',
    RESERVED = 'RESERVED', // Potentially for temporary hold during payment
    BLOCKED = 'BLOCKED',
    SELECTED_BY_USER = 'SELECTED_BY_USER' // Frontend only status
}