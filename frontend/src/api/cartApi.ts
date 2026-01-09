import api from './api';


export async function resetCartApi({ userId, guestId }: { userId?: string; guestId?: string }): Promise<{ message: string }> {
  const payload: any = {};
  if (userId) payload.userId = userId;
  if (guestId) payload.guestId = guestId;
  const res = await api.post('/cart/reset', payload, { withCredentials: true });
  return res.data;
}

export interface AddToCartParams {
  productId: string;
  quantity?: number;
  userId?: string;
  guestId?: string;
}

export interface GetCartParams {
  userId?: string;
  guestId?: string;
}

export interface CartProduct {
  _id: string;
  productId: any; // Có thể thay bằng kiểu Product nếu có
  quantity: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export async function addToCartApi({ productId, quantity = 1, userId, guestId }: AddToCartParams): Promise<CartProduct> {
  const payload: any = { productId, quantity };
  if (userId) payload.userId = userId;
  if (guestId) payload.guestId = guestId;
  const res = await api.post('/cart/add', payload, { withCredentials: true });
  return res.data;
}

export async function getCartApi({ userId, guestId }: GetCartParams): Promise<CartProduct[]> {
  const params: any = {};
  if (userId) params.userId = userId;
  if (guestId) params.guestId = guestId;
  const res = await api.get('/cart', { params, withCredentials: true });
  return res.data;
}

export async function removeFromCartApi(cartItemId: string): Promise<{ message: string }> {
  const res = await api.delete(`/cart/${cartItemId}`, { withCredentials: true });
  return res.data;
}

export async function updateCartQuantityApi(cartItemId: string, quantity: number): Promise<CartProduct> {
  const res = await api.patch(`/cart/${cartItemId}`, { quantity }, { withCredentials: true });
  return res.data;
}
