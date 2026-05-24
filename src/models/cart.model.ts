// Định nghĩa cấu trúc từng món hàng trong giỏ
interface CartItemDetail {
    id: number;
    title: string;
    price: number;
    avatar_path: string;
    quantity: number;
    total_price: number; // price * quantity
}

// Định nghĩa cấu trúc tóm tắt đơn hàng
interface CartSummary {
    subtotal: number;
    shipping_fee: number;
    total_amount: number;
    total_quantity: number;
}

// Đây chính là CartDataResponse - Cấu trúc cuối cùng API trả về
export interface CartDataResponse {
    user_id: number | null;
    items: CartItemDetail[];
    summary: CartSummary;
}