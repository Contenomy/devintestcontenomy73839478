export enum ProductCategory {
  Prodotto = "Prodotto",
  Consulenza = "Consulenza",
  IncontroInformale = "Incontro informale"
}

export interface ShopProduct {
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
  category: ProductCategory;
}
