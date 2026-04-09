
type Obj = {
    id: number
    bank_name: string
    bank_code: string
    account_number: string
    created_at: string
    is_default: number
    owner_name: string
}

export type BankAccount = Required<Obj>