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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${environment.serverUrl}/api/shop/products`, {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
            <Card>
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
    </Box>
  );
}
