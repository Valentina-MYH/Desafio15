import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

export const CartContext = createContext();

const CartProvider = ({ children }) => {

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const cartStorage = localStorage.getItem("cart");
    if (cartStorage) {
      setCart(cartStorage ? JSON.parse(cartStorage) : []);
    }
  }, []);
  
  const addToCart = (item) => {
    
    item.stock = cart.find((i) => i.id === item.id)
      ? item.stock
      : item.stock - 1;
    item.quantity = cart.find((i) => i.id === item.id) ? item.quantity + 1 : 1;
    const newCart = cart.filter((i) => i.id !== item.id);
    localStorage.setItem("cart", JSON.stringify([...newCart, item]));
    setCart([...newCart, item]);
    toast.success("Producto agregado al carrito.");
  };

  const removeItem = (id) => {
    if (cart.find((item) => item.id === id).quantity > 1) {
      const newCart = cart.map((item) => {
        if (item.id === id) {
          item.quantity = item.quantity - 1;
          item.stock = item.stock + 1;
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(newCart));
      setCart(newCart);
      toast.warning("Producto eliminado del carrito.");
    } else if (cart.find((item) => item.id === id).quantity === 1) {
      const newCart = cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(newCart));
      setCart(newCart);
      toast.warning("Producto eliminado del carrito.");
    }
  };

  const clearCart = () => {
    localStorage.removeItem("cart");
    setCart([]);
    toast.info("Carrito vaciado.");
  };

  const totalItems = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const totalCart = () => {
    return cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeItem,
        clearCart,
        totalItems,
        totalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider };