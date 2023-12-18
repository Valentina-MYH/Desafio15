import { useEffect, useState } from "react";
import "./App.css";
import ProductList from "./Components/Products/ProductsList.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./Context/CartContext.jsx";
import ProductForm from "./Components/Products/ProductsForm.jsx";


function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProductsData();
  }, []);

  const fetchProductsData = async () => {
    const url = "https://653ff79445bedb25bfc18468.mockapi.io/api/products-candles";

    try {
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
    } catch (error) {
      setError(true);
    }
  };
  if (error) return <p>Hubo un error al cargar los productos.</p>;

  if (isLoading) return <p>Cargando...</p>;
  
 
  return (
    <>
    <ProductForm  />
    <CartProvider>
      { products.length > 0 ? (
        <ProductList
      products={products}
      fetchProductsData={fetchProductsData}
        />
      ) : (
        <p>No hay productos para mostrar</p>
      )  }
      <ToastContainer/>
    </CartProvider>
    </>
  )
}
  
    


export default App;
