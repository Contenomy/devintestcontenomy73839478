import React, { useState, useEffect, useContext } from "react";
import { environment } from '../../environment/environment.development';
import { authContext } from "../../context/AuthContext";
import { CircularProgress, Alert } from '@mui/material';
import { 
  Box, 
  Typography, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText
} from "@mui/material";
import { Edit as EditIcon, Close as DeleteIcon } from '@mui/icons-material';
import { useForm, SubmitHandler, Controller } from "react-hook-form";

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

export default function SellProductsServices() {
  const { profile } = useContext(authContext);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = environment.serverUrl;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!profile || !profile.id) {
        setError('Utente non autenticato. Effettua il login per visualizzare i tuoi prodotti.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/shop/products/creator/${profile.id}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          if (response.status === 404) {
            setProducts([]);
            setLoading(false);
            return;
          }
          throw new Error(`Errore ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data.map((p: any) => {
          console.log('Product data:', p); // Debug log
          return {
            id: p.id.toString(),
            titolo: p.name,
            descrizione: p.description,
            prezzo: p.price,
            disponibilita: 1,
            categoria: p.category || ProductCategory.Prodotto,
            immagine: p.imageUrl
          };
        }));
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : 'Errore nel caricamento dei prodotti');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [profile, API_BASE_URL]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };
  
  const handleAddProduct = async (data: ProductFormData) => {
    if (!profile) {
      setError('Devi essere loggato per creare prodotti');
      return;
    }

    try {
      const productData = {
        name: data.titolo,
        description: data.descrizione,
        price: data.prezzo,
        creatorId: profile.id,
        category: data.categoria,
        imageUrl: data.immagine && data.immagine.length > 0 ? URL.createObjectURL(data.immagine[0]) : ''
      };
      console.log('Creating/updating product with category:', data.categoria);

      const url = selectedProduct 
        ? `${API_BASE_URL}/api/shop/products/${selectedProduct.id}`
        : `${API_BASE_URL}/api/shop/products`;

      const response = await fetch(url, {
        method: selectedProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Errore nella gestione del prodotto');
      }

      const savedProduct = await response.json();
      
      if (selectedProduct) {
        setProducts(prev => prev.map(product => 
          product.id === selectedProduct.id 
            ? {
                id: savedProduct.id.toString(),
                titolo: savedProduct.name,
                descrizione: savedProduct.description,
                prezzo: savedProduct.price,
                disponibilita: 1,
                categoria: savedProduct.category || ProductCategory.Prodotto,
                immagine: savedProduct.imageUrl
              }
            : product
        ));
      } else {
        setProducts(prev => [...prev, {
          id: savedProduct.id.toString(),
          titolo: savedProduct.name,
          descrizione: savedProduct.description,
          prezzo: savedProduct.price,
          disponibilita: 1,
          categoria: savedProduct.category || ProductCategory.Prodotto,
          immagine: savedProduct.imageUrl
        }]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error handling product:', error);
      setError(error instanceof Error ? error.message : 'Errore nella gestione del prodotto');
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/shop/products/${selectedProduct.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Errore nella cancellazione del prodotto');
        }

        setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
        setOpenDeleteDialog(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(error instanceof Error ? error.message : 'Errore nella cancellazione del prodotto');
      }
    }
  };

  const productToFormData = (product: Product): ProductFormData => ({
    titolo: product.titolo,
    descrizione: product.descrizione,
    prezzo: product.prezzo,
    disponibilita: product.disponibilita,
    categoria: product.categoria
  });

  function AddProductDialog() {
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<ProductFormData>({
      defaultValues: selectedProduct ? productToFormData(selectedProduct) : {
        titolo: '',
        descrizione: '',
        prezzo: 0,
        disponibilita: 1,
        categoria: ProductCategory.Prodotto
      }
    });
    
    React.useEffect(() => {
      if (selectedProduct) {
        reset(productToFormData(selectedProduct));
      }
    }, [reset]);

    const onSubmit: SubmitHandler<ProductFormData> = (data) => {
      handleAddProduct(data);
    };

    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedProduct ? 'Modifica prodotto' : 'Nuovo prodotto'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Titolo"
                  error={!!errors.titolo}
                  helperText={errors.titolo ? "Campo richiesto" : ""}
                  {...register("titolo", { required: true })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Descrizione"
                  error={!!errors.descrizione}
                  helperText={errors.descrizione ? "Campo richiesto" : ""}
                  {...register("descrizione", { required: true })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="file"
                  InputLabelProps={{ shrink: true }}
                  label="Immagine"
                  {...register("immagine")}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Categoria</InputLabel>
                  <Controller
                    name="categoria"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        error={!!errors.categoria}
                        label="Categoria"
                      >
                        {Object.values(ProductCategory).map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.categoria && (
                    <FormHelperText error>Campo richiesto</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Box>
                  <TextField
                    fullWidth
                    type="number"
                    label="Prezzo in euro"
                    error={!!errors.prezzo}
                    helperText={errors.prezzo ? "Campo richiesto" : ""}
                    {...register("prezzo", { 
                      required: true,
                      valueAsNumber: true,
                      min: 0
                    })}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                    Il prezzo sarà mostrato in supportshare
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Disponibilità"
                  error={!!errors.disponibilita}
                  helperText={errors.disponibilita ? "Campo richiesto (max 10)" : ""}
                  {...register("disponibilita", { 
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                    max: 10
                  })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Annulla</Button>
            <Button type="submit" variant="contained" color="primary">
              Salva prodotto
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          Vendi prodotti e servizi
        </Typography>
        <Button 
          variant="contained"
          color="success" 
          onClick={handleOpenDialog}
        >
          Inserisci
        </Button>
      </Box>
      <Typography variant="body1" gutterBottom>
        Vendere prodotti e servizi aiuta a ridurre la disponibilità delle tue supportshare
        e quindi a farle crescere di valore
      </Typography>

      <Box sx={{ mt: 3, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtra per categoria</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ProductCategory | '')}
            label="Filtra per categoria"
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        ) : products.filter(product => !selectedCategory || product.categoria === selectedCategory)
          .length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            Nessun prodotto disponibile. Usa il pulsante "Inserisci" per aggiungere prodotti.
          </Typography>
        ) : (
          products
            .filter(product => !selectedCategory || product.categoria === selectedCategory)
            .map((product) => (
            <Box
              key={product.id}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 2,
                mb: 2,
                '&:hover': {
                  boxShadow: 1
                }
              }}
            >
              <Grid container spacing={2}>
                {product.immagine && (
                  <Grid item xs={12} sm={3}>
                    <Box
                      component="img"
                      src={product.immagine}
                      alt={product.titolo}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={product.immagine ? 9 : 12}>
                  <Typography variant="h6" gutterBottom>
                    {product.titolo}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {product.descrizione}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body2" color="primary">
                        Prezzo: {product.prezzo}€
                      </Typography>
                      <Typography variant="body2" color={product.disponibilita > 0 ? "success.main" : "error.main"}>
                        Disponibilità: {product.disponibilita}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenDialog(true);
                        }}
                      >
                        <EditIcon sx={{ color: 'grey.500' }} />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => {
                          setSelectedProduct(product);
                          setOpenDeleteDialog(true);
                        }}
                      >
                        <DeleteIcon sx={{ color: 'error.main' }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Box>

      <AddProductDialog />

      {/* Dialog di conferma eliminazione */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Eliminare il prodotto?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Annulla</Button>
          <Button 
            onClick={handleDeleteProduct}
            color="error"
          >
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
