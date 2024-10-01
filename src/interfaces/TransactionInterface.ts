export interface CreateTransactionInterface {
    type: string;          
    amount: string;         
    narration: string; 
    currency: string;
    deposit_address: string;
    clientSecret: string;
    userId: string;
    id: string;
}