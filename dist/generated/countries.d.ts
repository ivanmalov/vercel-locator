export interface Country {
    name: {
        common: string;
        official: string;
        commonArticle: string | null;
        officialArticle: string | null;
    };
    topLevelDomain: string | null;
    currency: {
        code: string;
        name: string;
        singular: string;
        plural: string;
        symbol: string;
    } | null;
    phone: string | null;
    languages: {
        code: string;
        name: string;
        percentage: number | null;
        status: string | null;
    }[];
}
export declare const countries: Record<string, Country>;
