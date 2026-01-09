
import express from 'express';
import { addToCart, getCart, removeFromCart, updateCartQuantity, resetCart } from '../controllers/cartController.js';

const router = express.Router();
// Reset toàn bộ giỏ hàng
router.post('/reset', resetCart);

// Thêm vào giỏ (không cần đăng nhập)
router.post('/add', addToCart);
// Lấy giỏ hàng (theo userId hoặc guestId)
router.get('/', getCart);
// Xóa sản phẩm khỏi giỏ
router.delete('/:cartItemId', removeFromCart);
// Cập nhật số lượng sản phẩm trong giỏ
router.patch('/:cartItemId', updateCartQuantity);

export default router;
