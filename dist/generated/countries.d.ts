export interface Country {
    name: string;
    currencyCode: string | null;
    currency: string | null;
    phone: string | null;
    languages: {
        code: string;
        name: string;
    }[];
}
export declare const countries: Record<string, Country>;
