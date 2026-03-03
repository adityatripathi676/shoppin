import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { createOrder, createPaymentIntent, getProducts } from '../api/client'

const ShopContext = createContext(null)

const CART_KEY = 'shoppin-cart-v1'

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [cartItems, setCartItems] = useState(() => {
    const cached = localStorage.getItem(CART_KEY)
    return cached ? JSON.parse(cached) : []
  })

  const refreshProducts = useCallback(async () => {
    setIsLoadingProducts(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } finally {
      setIsLoadingProducts(false)
    }
  }, [])

  useEffect(() => {
    refreshProducts()
  }, [refreshProducts])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (productId) => {
    setCartItems((previous) => {
      const found = previous.find((item) => item.productId === productId)
      if (found) {
        return previous.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...previous, { productId, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setCartItems((previous) =>
      previous.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((previous) => previous.filter((item) => item.productId !== productId))
  }

  const clearCart = () => setCartItems([])

  const cartDetailedItems = useMemo(() => {
    return cartItems
      .map((item) => {
        const product = products.find((productItem) => productItem.id === item.productId)
        if (!product) {
          return null
        }
        return {
          ...item,
          product,
          lineTotal: Number((product.price * item.quantity).toFixed(2)),
        }
      })
      .filter(Boolean)
  }, [cartItems, products])

  const subtotal = useMemo(
    () => Number(cartDetailedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)),
    [cartDetailedItems],
  )

  const shipping = cartDetailedItems.length > 0 ? 8 : 0
  const tax = Number((subtotal * 0.08).toFixed(2))
  const total = Number((subtotal + shipping + tax).toFixed(2))

  const placeOrder = async (customer) => {
    const paymentIntent = await createPaymentIntent(total)

    const order = await createOrder({
      customer,
      items: cartDetailedItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      paymentMethod: 'DemoPay',
      paymentReference: paymentIntent.providerPaymentId,
    })

    clearCart()
    await refreshProducts()
    return order
  }

  const value = {
    products,
    isLoadingProducts,
    refreshProducts,
    cartItems: cartDetailedItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shipping,
    tax,
    total,
    placeOrder,
  }

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => {
  const context = useContext(ShopContext)
  if (!context) {
    throw new Error('useShop must be used within ShopProvider')
  }
  return context
}
