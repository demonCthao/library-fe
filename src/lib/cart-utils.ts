import Cookies from "js-cookie";

const CART_KEY = "user_cart";

export interface CartItemCookie {
    id: number;
    quantity: number;
}

export const CartService = {
    // 1. Lấy giỏ hàng - Thêm try-catch để tránh crash nếu cookie lỗi format
    getCart: (): CartItemCookie[] => {
        try {
            const data = Cookies.get(CART_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Lỗi parse giỏ hàng từ Cookie:", error);
            return [];
        }
    },

    // 2. Hàm set giỏ hàng dùng chung để code ngắn gọn
    setCart: (cart: CartItemCookie[]) => {
        Cookies.set(CART_KEY, JSON.stringify(cart), { expires: 7, path: "/" });
    },

    // 3. Thêm mới sản phẩm
    addToCart: (productId: number, qty: number = 1) => {
        const cart = CartService.getCart();
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += qty;
        } else {
            cart.push({ id: productId, quantity: qty });
        }

        CartService.setCart(cart);
    },

    // 4. Cập nhật số lượng (+ hoặc -)
    updateQty: (productId: number, newQty: number) => {
        const cart = CartService.getCart();
        const updatedCart = cart.map(item =>
            item.id === productId ? { ...item, quantity: Math.max(1, newQty) } : item
        );
        CartService.setCart(updatedCart);
    },

    // 5. Xóa khỏi giỏ hàng
    removeFromCart: (productId: number) => {
        const cart = CartService.getCart().filter(item => item.id !== productId);
        CartService.setCart(cart);
    },

    // 6. Xóa sạch giỏ hàng (Dùng sau khi thanh toán thành công)
    clearCart: () => {
        Cookies.remove(CART_KEY, { path: "/" });
    }
};