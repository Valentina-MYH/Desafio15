import { createContext, useState, useEffect} from "react";
import { toast } from "react-toastify";
import { db } from "../firebaseConexion";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {

    const [products, setProducts] = useState([]);
    const [updateProduct, setUpdateProduct] = useState(null);
    const [errorLoad, setErrorLoad] = useState(false);
    const [loading, setLoading] = useState(false);

    const productsCollection = collection(db, "products");

    const getProducts = async () => {
        setLoading(false);
        const productsDataFirebase = await getDocs(productsCollection);
        if (productsDataFirebase) {
            productsDataFirebase.docs
                .map((doc) => ({ ...doc.data(), id: doc.id }))
                .sort((a, b) => a.name.localeCompare(b.name));

            setProducts(
                productsDataFirebase.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }))
                    .sort((a, b) => a.name.localeCompare(b.name))
            );
            setLoading(true);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            getProducts();
        }, 1000);
    }, []);

    const addProduct = (product) => {    
        const existProduct = products.find((p) => p.name === product.name);
        if (existProduct) {
            setErrorLoad(true);
            toast.warning('El producto que intenta cargar ya existe!')
            return;
        }

        if (product.name.trim() === "" || product.description.trim() === "" || product.price.trim() === "")  {
            toast.error('Todos los campos son obligatorios!')
            return;
        }
        addDoc(productsCollection, product);
        toast.success('Producto agregado con éxito!')
        getProducts();
    } 

    const deleteProduct = async (name) => {
        setErrorLoad(false);
        const productsDataFirebase = await getDocs(productsCollection);
        const productDelete = productsDataFirebase.docs
            .map((doc) => ({ name: doc.data().name }))
            .filter((doc) => doc.name === name);

        const querySnapshot = await getDocs(productsCollection);
        querySnapshot.forEach((doc) => {
            if (doc.data().name === productDelete[0].name) {
                deleteDoc(doc.ref);
            }
            
        });
        setTimeout(() => {
            toast.info('Producto eliminado con éxito!')
            getProducts();
        }, 500);
    };

    const editProduct = async (name, product) => {
        const productsDataFirebase = await getDocs(productsCollection);
        const productEdit = productsDataFirebase.docs
            .map((doc) => ({ name: doc.data().name }))
            .filter((doc) => doc.name === name);

        const querySnapshot = await getDocs(productsCollection);
        querySnapshot.forEach((doc) => {
            if (doc.data().name === productEdit[0].name) 
            {
                updateDoc(doc.ref, product);
            }
        });
        setTimeout(() => {
            toast.success('Producto actualizado con éxito!')
            getProducts();
        }, 500);
    }

    return (
        <ProductContext.Provider
            value={{
                products,
                updateProduct,
                errorLoad,
                loading,
                addProduct,
                deleteProduct,
                editProduct,
                setUpdateProduct,
                setErrorLoad,
            }}
        >
            {children}
        </ProductContext.Provider>
    );

}

export { ProductProvider };