export interface ContentCreatorInfo {
    userId: string;
    username: string;
    nickname: string;
    email: string;
    phoneNumber: string;
    totalQuantity: number;
    availableQuantity: number;
    currentValue: number;
    creatorAssetStartDate: string;
    creatorAssetEndDate: string | null;
    description: string;
    creatorAssetStatus: string;
    ipoStartDate: string | null;
    initialPrice: number;
    ipoStatus: string | null;
  }