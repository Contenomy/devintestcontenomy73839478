import React, { createContext, useState, useContext, ReactNode } from 'react';

// Import the Product and ProductCategory types from sell-products-services
enum ProductCategory {
  Prodotto = "Prodotto",
  Consulenza = "Consulenza",
  IncontroInformale = "Incontro informale"
}

interface ProductFormData {
  titolo: string;
  descrizione: string;
  immagine?: FileList;
  prezzo: number;
  disponibilita: number;
  categoria: ProductCategory;
}

interface Product extends Omit<ProductFormData, 'immagine'> {
  immagine?: string;
  id: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev =>
      prev.map(p => (p.id === product.id ? product : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}

export type { Product, ProductFormData };
export { ProductCategory };
