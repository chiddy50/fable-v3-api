export interface CreateTransactionInterface {
    type: string;          
    amount: string;          
    currency: string;
    deposit_address: string;
    clientSecret: string;
    id: string;
}