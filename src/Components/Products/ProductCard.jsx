import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { FaCartShopping, FaTrashCan } from "react-icons/fa6";
import { CartContext } from "../../Context/CartContext";

const ProductCard = ({ product, fetchProductsData }) => {
  const { addToCart } = useContext(CartContext)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDelete = async (id) => {
    try {
      setIsDeleteLoading(true);
      const response = await fetch(
        `https://653ff79445bedb25bfc18468.mockapi.io/api/products-candles/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("El producto no se pudo eliminar.");
      toast.success("Producto eliminado con éxito.");
      fetchProductsData();
      setIsDeleteLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("El producto no se pudo eliminar.");
      setIsDeleteLoading(false);
    }
  };
  return (
    <div className="product-card">
      {isDeleteLoading ? (
        <p>Eliminando producto...</p>
      ) : (
        <>
          <h2>{product.nombre}</h2>
          <p>{product.descripcion}</p>
          <p>Precio: ${product.precio}</p>
          <div className="product-card__button-container">
            <button onClick={() => addToCart(product)}>
              {" "}
              <FaCartShopping />
              Agregar
            </button>
            <button onClick={() => handleDelete(product.id)}>
              {" "}
              <FaTrashCan />
              Eliminar
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;
