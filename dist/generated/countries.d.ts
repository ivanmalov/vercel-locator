export interface Country {
    name: string;
    currencyCode: string | null;
    currency: string | null;
    phone: string | null;
    languages: {
        code: string;
        name: string;
        percentage: number | null;
        status: string | null;
    }[];
}
export declare const countries: Record<string, Country>;
