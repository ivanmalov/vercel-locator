export interface Country {
    name: string;
    currency: string | null;
    phone: string | null;
}
export declare const countries: Record<string, Country>;
