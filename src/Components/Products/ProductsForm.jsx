import { useState } from "react";
import { toast } from "react-toastify";

const ProductForm = ({ fetchData }) => {
  const [productFormValues, setProductFormValues] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
  });

  const handleUpdateProductFormValues = (value, inputReference) => {
    setProductFormValues((prevState) => ({
      ...prevState,
      [inputReference]: value,
    }));
  };

  const handleSubmitForm = async () => {
    try {
      const response = await fetch(
        "https://653ff79445bedb25bfc18468.mockapi.io/api/products-candles",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productFormValues),
        }
      );

      if (!response.ok) {
        throw new Error("Error al agregar un producto.");
      }

      // Limpiar el formulario después de agregar el producto
      setProductFormValues({
        nombre: "",
        descripcion: "",
        precio: 0,
      });

      // Actualizar los productos después de agregar uno nuevo
      try {
        await fetchData();
      } catch (error) {
        toast.error("Error al actualizar los datos.");
      }

      toast.success("Producto agregado con éxito.");
    } catch (error) {
      toast.error("Error al agregar un producto.");
    }
  };

  return (
    <div className="conteiner">
      <input
        className="input"
        type="text"
        placeholder={"nombre"}
        value={productFormValues.nombre}
        onChange={(e) =>
          handleUpdateProductFormValues(e.target.value, "nombre")
        }
      />
      <input
        className="input"
        type="text"
        placeholder={"descripcion"}
        value={productFormValues.descripcion}
        onChange={(e) =>
          handleUpdateProductFormValues(e.target.value, "descripcion")
        }
      />
      <input
        className="input"
        type="number"
        placeholder={"precio"}
        value={productFormValues.precio}
        onChange={(e) =>
          handleUpdateProductFormValues(e.target.value, "precio")
        }
      />
      <button className="button"onClick={handleSubmitForm}>Agregar Producto</button>
    </div>
  );
};

export default ProductForm;
