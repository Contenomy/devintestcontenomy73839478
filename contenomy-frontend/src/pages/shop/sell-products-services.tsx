import React, { useState } from "react";
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
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | ''>('');

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleAddProduct = (data: ProductFormData) => {
    if (selectedProduct) {
      // Edit mode - update existing product
      setProducts(prev => prev.map(product => 
        product.id === selectedProduct.id 
          ? {
              ...product,
              ...data,
              immagine: data.immagine && data.immagine.length > 0 
                ? URL.createObjectURL(data.immagine[0]) 
                : product.immagine
            }
          : product
      ));
    } else {
      // Create mode - add new product
      const newProduct: Product = {
        ...data,
        id: Date.now().toString(),
        immagine: data.immagine && data.immagine.length > 0 ? URL.createObjectURL(data.immagine[0]) : undefined
      };
      setProducts(prev => [...prev, newProduct]);
    }
    handleCloseDialog();
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));
      setOpenDeleteDialog(false);
      setSelectedProduct(null);
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
    }, [selectedProduct, reset]);

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

      {/* Filtro Categoria */}
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

      {/* Lista dei prodotti */}
      <Box sx={{ mt: 4 }}>
        {products
          .filter(product => !selectedCategory || product.categoria === selectedCategory)
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
