import React, { useEffect, useState, useCallback } from 'react';
import { CircularProgress, Alert, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { ShopService } from '../../services/ShopService';
import { ShopProduct, ProductCategory } from '../../types/shop';
import './Shop.css';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');

  const handleOpenDialog = (product: ShopProduct) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProduct(null);
    setDialogOpen(false);
  };

  const handleCategoryChange = useCallback((e: SelectChangeEvent<string>) => {
    console.log('Debug - Category changed to:', e.target.value);
    setSelectedCategory(e.target.value as ProductCategory | '');
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('Fetching products...');
      setLoading(true);
      setError(null);
      
      setLoading(true);
      setError(null);
      setProducts([]); // Clear existing products

      try {
        console.log('Attempting to fetch from backend...');
        const response = await fetch('http://localhost:5119/api/shop/products');
        
        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Backend data received:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from backend');
        }
        
        setProducts(data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Backend error:', error);
        
        setError('⚠️ Attenzione: Il server non risponde.\n\n' + 
                'Non è possibile caricare i prodotti in questo momento.\n' + 
                'Per favore, riprova più tardi.');
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ p: 3, width: '100%' }} className="shop-container">
      {console.log('Rendering Shop component, error state:', error)}
      
      <Box className="shop-header">
        <Typography variant="h4" component="h1" gutterBottom>
          Shop
        </Typography>
        <Typography variant="body1" gutterBottom>
          Esplora i prodotti e servizi disponibili
        </Typography>
      </Box>

      {/* Loading and Error states */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Box sx={{ my: 2 }}>
          <Alert 
            severity="error" 
            variant="filled"
            sx={{ mb: 2 }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {error}
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Category filter */}
      <Box className="shop-category-filter" sx={{ width: '100%', mb: 3 }}>
        <FormControl variant="outlined" sx={{ minWidth: 200 }}>
          <InputLabel>Filtra per categoria</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Filtra per categoria"
          >
            <MenuItem value="">
              <em>Tutte le categorie</em>
            </MenuItem>
            {Object.values(ProductCategory).map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : (

        <Grid container spacing={3} className="shop-grid">
          {console.log('Products in render:', products, 'Selected category:', selectedCategory)}
          {products && products.length > 0 ? (
            products
              .filter(product => !selectedCategory || product.category === selectedCategory)
              .map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card 
                    onClick={() => handleOpenDialog(product)}
                    className="product-card"
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      m: 1
                    }}
                  >
                    {product.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.imageUrl}
                        alt={product.name}
                        className="product-image"
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ mt: 'auto' }}>
                        <Typography variant="subtitle1" className="product-price" sx={{ fontWeight: 'bold' }}>
                          {product.price} supportshare
                        </Typography>
                        <Typography variant="caption" display="block" className="product-creator">
                          By {product.creatorName}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                Nessun prodotto disponibile
              </Typography>
            </Grid>
          )}
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
            onClick={async () => {
              if (selectedProduct) {
                try {
                  await ShopService.purchaseProduct(selectedProduct.id);
                  handleCloseDialog();
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Failed to purchase product');
                }
              }
            }}
          >
            Acquista
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Shop;
