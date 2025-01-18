import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useProducts, Product, ProductCategory } from "@context/ProductContext";

export default function Shop() {
  const { products, addProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "">("");

  // Add test products on component mount
  useEffect(() => {
    const addInitialProducts = async () => {
      if (products.length === 0) {
        const initialProducts = [
          {
            id: '1',
            titolo: 'Consulenza Marketing',
            descrizione: 'Sessione di consulenza marketing personalizzata',
            prezzo: 100,
            disponibilita: 5,
            categoria: ProductCategory.Consulenza,
            immagine: 'https://picsum.photos/200/300'
          },
          {
            id: '2',
            titolo: 'Corso Online',
            descrizione: 'Corso completo di digital marketing',
            prezzo: 200,
            disponibilita: 10,
            categoria: ProductCategory.Prodotto,
            immagine: 'https://picsum.photos/200/300'
          },
          {
            id: '3',
            titolo: 'Coffee Chat',
            descrizione: 'Incontro informale per discutere di business',
            prezzo: 50,
            disponibilita: 3,
            categoria: ProductCategory.IncontroInformale,
            immagine: 'https://picsum.photos/200/300'
          }
        ];
        
        for (const product of initialProducts) {
          await new Promise(resolve => setTimeout(resolve, 100)); // Prevent race conditions
          addProduct(product);
        }
      }
    };
    
    addInitialProducts();
  }, [products.length, addProduct]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shop
      </Typography>
      <Typography variant="body1" gutterBottom>
        Esplora i prodotti e servizi disponibili
      </Typography>

      <Box sx={{ mb: 3, mt: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | "")}
            label="Categoria"
          >
            <MenuItem value="">Tutte le categorie</MenuItem>
            {Object.values(ProductCategory).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {products.filter(product => !selectedCategory || product.categoria === selectedCategory).length === 0 ? (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Nessun prodotto disponibile al momento.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {products
            .filter(product => !selectedCategory || product.categoria === selectedCategory)
            .map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card 
                onClick={() => handleProductClick(product)}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    cursor: 'pointer'
                  }
                }}
              >
                {product.immagine && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.immagine}
                    alt={product.titolo}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {product.titolo}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip 
                      label={`${product.prezzo} supportshare`}
                      color="primary"
                      sx={{ maxWidth: 'fit-content' }}
                    />
                    <Chip 
                      label={`Disponibilità: ${product.disponibilita}`}
                      color={product.disponibilita > 0 ? "success" : "error"}
                      sx={{ maxWidth: 'fit-content' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Product Details Modal */}
      <Dialog 
        open={!!selectedProduct} 
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        {selectedProduct && (
          <>
            <DialogTitle>{selectedProduct.titolo}</DialogTitle>
            <DialogContent>
              {selectedProduct.immagine && (
                <Box sx={{ mb: 2 }}>
                  <img 
                    src={selectedProduct.immagine} 
                    alt={selectedProduct.titolo}
                    style={{ 
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }}
                  />
                </Box>
              )}
              <Typography variant="body1" paragraph>
                {selectedProduct.descrizione}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Prezzo: {selectedProduct.prezzo} supportshare
                </Typography>
                <Typography 
                  variant="subtitle1"
                  color={selectedProduct.disponibilita > 0 ? "success.main" : "error.main"}
                >
                  Disponibilità: {selectedProduct.disponibilita}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Annulla</Button>
              <Button 
                variant="contained" 
                color="primary"
                disabled={selectedProduct.disponibilita === 0}
              >
                Acquista
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
