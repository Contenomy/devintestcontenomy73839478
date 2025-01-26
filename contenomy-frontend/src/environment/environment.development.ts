import IMarketShare from "@model/MarketShare";
import { loginProviders } from "./external-providers/external-providers.environment.development"

export const environment = {
    loginProviders,
    serverUrl: `http://localhost:7126`
}


export const shares: IMarketShare[] = [
    {
        id: 1,
        name: "ABC",
        price: 2.78,
        marketCap: 547_000,
        thumbnail: "/next.svg",
        trend: +1.8,
        history: [
            {
                date: '2023-12-31 04:05:34',
                value: 5.21
            },
            {
                date: '2024-01-01 12:21:42',
                value: 2.62
            },
            {
                date: '2024-01-02 19:15:17',
                value: 4.42
            }
        ]
    },

    {
        id: 2,
        name: "DEF",
        price: 3.24,
        marketCap: 923_000,
        trend: -0.45,
        history: [
            {
                date: '2023-12-31 08:22:51',
                value: 3.21
            },
            {
                date: '2024-01-01 12:21:42',
                value: 4.42
            },
            {
                date: '2024-01-02 19:15:17',
                value: 3.97
            }
        ]
    },
];
