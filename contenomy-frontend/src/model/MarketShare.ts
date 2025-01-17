export default interface IMarketShare {
    id: number; 
    name: string;
    marketCap: number;
    price: number;
    thumbnail?: string;
    trend: number;
    history: HistoryData[];
}

export interface HistoryData {
    date: string | Date;
    value: number;
}
