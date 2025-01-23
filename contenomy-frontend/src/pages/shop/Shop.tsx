import React, { useEffect, useState } from 'react';
import { environment } from '../../environment/environment.development';
import { CircularProgress, Alert } from '@mui/material';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';

interface ShopProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  creatorId: string;
  creatorName: string;
  isActive: boolean;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
}

export default function Shop() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (product: ShopProduct) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
  };

  // Test data for frontend-only verification
  const testProducts: ShopProduct[] = [{
    id: 1,
    name: "Test Product",
    description: "This is a test product description that shows all the details about the product.",
    price: 100,
    creatorId: "test-creator",
    creatorName: "Test Creator",
    isActive: true,
    imageUrl: "https://picsum.photos/200",
    createdAt: new Date().toISOString(),
    updatedAt: null
  }];

  useEffect(() => {
    // Skip API call for frontend-only verification
    setLoading(false);
    setError(null);
    setProducts(testProducts);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shop
      </Typography>
      <Typography variant="body1" gutterBottom>
        Esplora i prodotti e servizi disponibili
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card 
              onClick={() => handleOpenDialog(product)}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              {product.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl}
                  alt={product.name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  {product.price} supportshare
                </Typography>
                <Typography variant="caption" display="block">
                  By {product.creatorName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          ))}
        </Grid>
      )}

      {/* Product Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedProduct?.name}</DialogTitle>
        <DialogContent>
          {selectedProduct?.imageUrl && (
            <Box
              component="img"
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 300,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2
              }}
            />
          )}
          <Typography variant="body1" paragraph>
            {selectedProduct?.description}
          </Typography>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Prezzo: {selectedProduct?.price} supportshare
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Quantità disponibile: 10
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Annulla
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => {
              // TODO: Implement purchase logic
              console.log('Purchase clicked for product:', selectedProduct?.id);
              handleCloseDialog();
            }}
          >
            Acquista
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
