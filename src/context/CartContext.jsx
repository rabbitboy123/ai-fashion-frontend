import React, { createContext, useState, useEffect, useCallback } from 'react';
import cartService from '@/services/cartService';
import { useAuth } from '@/hooks/useAuth';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalQuantity: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cartService.getCart();
      const items = data.items || [];
      const totalQuantity = data.totalQuantity ?? items.reduce((sum, i) => sum + (i.quantity || 0), 0);
      const totalAmount = data.totalAmount ?? items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0);
      setCart({ items, totalQuantity, totalAmount });
    } catch (err) {
      console.warn('Lỗi khi đồng bộ giỏ hàng:', err);
      setError(err?.response?.data?.message || 'Không thể đồng bộ giỏ hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Đồng bộ giỏ hàng khi mount hoặc trạng thái đăng nhập thay đổi
  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated) {
      queueMicrotask(() => {
        if (isMounted) {
          setCart({ items: [], totalQuantity: 0, totalAmount: 0 });
        }
      });
      return;
    }

    const syncCart = async () => {
      try {
        const data = await cartService.getCart();
        if (isMounted) {
          const items = data.items || [];
          const totalQuantity =
            data.totalQuantity ?? items.reduce((sum, i) => sum + (i.quantity || 0), 0);
          const totalAmount =
            data.totalAmount ??
            items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0);
          setCart({ items, totalQuantity, totalAmount });
        }
      } catch (err) {
        console.warn('Lỗi khi đồng bộ giỏ hàng ban đầu:', err);
      }
    };

    syncCart();

    const handleLogout = () => {
      if (isMounted) {
        setCart({ items: [], totalQuantity: 0, totalAmount: 0 });
      }
    };

    window.addEventListener('bespoke_logout', handleLogout);

    return () => {
      isMounted = false;
      window.removeEventListener('bespoke_logout', handleLogout);
    };
  }, [isAuthenticated]);

  /**
   * Thêm sản phẩm biến thể vào giỏ
   * @param {Object} variant - Object ProductVariant { id, sizeName, colorName, stockQuantity, additionalPrice, ... }
   * @param {Object} product - Object Product { id, name, price, imageUrl, brand, ... }
   * @param {number} quantity - Số lượng cần thêm
   */
  const addToCart = useCallback(
    async (variant, product, quantity = 1) => {
      setLoading(true);
      setError(null);
      try {
        const unitPrice =
          Number(product?.price || 0) + Number(variant?.additionalPrice || 0);

        const fallbackData = {
          id: variant?.id,
          productId: product?.id,
          productName: product?.name,
          sizeName: variant?.sizeName,
          colorName: variant?.colorName,
          unitPrice,
          imageUrl: variant?.imageUrl || product?.imageUrl,
          brand: product?.brand || 'Bespoke Atelier',
        };

        const updated = await cartService.addToCart(variant?.id, quantity, fallbackData);
        if (updated) {
          const items = updated.items || [];
          const totalQuantity =
            updated.totalQuantity ?? items.reduce((sum, i) => sum + (i.quantity || 0), 0);
          const totalAmount =
            updated.totalAmount ??
            items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0);
          setCart({ items, totalQuantity, totalAmount });
        } else {
          await refreshCart();
        }
        return true;
      } catch (err) {
        console.error('Lỗi khi thêm vào giỏ hàng:', err);
        const msg = err?.response?.data?.message || 'Không thể thêm sản phẩm vào giỏ hàng.';
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [refreshCart]
  );

  /**
   * Cập nhật số lượng của một mục (Optimistic Update 0ms)
   */
  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      if (quantity < 1) return;

      let previousCart;
      setCart((prev) => {
        previousCart = prev;
        const newItems = prev.items.map((item) => {
          if (item.id === itemId || item.variantId === itemId || item.productVariantId === itemId) {
            return { ...item, quantity };
          }
          return item;
        });
        const totalQuantity = newItems.reduce((sum, i) => sum + (i.quantity || 0), 0);
        const totalAmount = newItems.reduce(
          (sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0),
          0
        );
        return { items: newItems, totalQuantity, totalAmount };
      });

      try {
        const updated = await cartService.updateCartItem(itemId, quantity);
        if (updated && updated.items) {
          const items = updated.items || [];
          const totalQuantity =
            updated.totalQuantity ?? items.reduce((sum, i) => sum + (i.quantity || 0), 0);
          const totalAmount =
            updated.totalAmount ??
            items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0);
          setCart({ items, totalQuantity, totalAmount });
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật số lượng:', err);
        if (previousCart) {
          setCart(previousCart);
        }
      }
    },
    []
  );

  /**
   * Xóa một mục khỏi giỏ hàng (Optimistic Update 0ms)
   */
  const removeFromCart = useCallback(
    async (itemId) => {
      let previousCart;
      setCart((prev) => {
        previousCart = prev;
        const newItems = prev.items.filter(
          (item) => item.id !== itemId && item.variantId !== itemId && item.productVariantId !== itemId
        );
        const totalQuantity = newItems.reduce((sum, i) => sum + (i.quantity || 0), 0);
        const totalAmount = newItems.reduce(
          (sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0),
          0
        );
        return { items: newItems, totalQuantity, totalAmount };
      });

      try {
        const updated = await cartService.removeCartItem(itemId);
        if (updated && updated.items) {
          const items = updated.items || [];
          const totalQuantity =
            updated.totalQuantity ?? items.reduce((sum, i) => sum + (i.quantity || 0), 0);
          const totalAmount =
            updated.totalAmount ??
            items.reduce((sum, i) => sum + (i.unitPrice || 0) * (i.quantity || 0), 0);
          setCart({ items, totalQuantity, totalAmount });
        }
      } catch (err) {
        console.error('Lỗi khi xóa khỏi giỏ hàng:', err);
        if (previousCart) {
          setCart(previousCart);
        }
      }
    },
    []
  );

  /**
   * Xóa sạch giỏ hàng (khi đặt hàng thành công)
   */
  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      await cartService.clearCart();
      setCart({ items: [], totalQuantity: 0, totalAmount: 0 });
    } catch (err) {
      console.error('Lỗi khi dọn giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        totalQuantity: cart.totalQuantity,
        totalAmount: cart.totalAmount,
        items: cart.items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
