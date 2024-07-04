export declare const DOCUMENT_TYPE_1: {
    items: {
        item: ({
            id: string;
            type: string;
            name: string;
            ppu: number;
            batters: {
                batter: {
                    id: string;
                    type: string;
                }[];
            };
            topping: {
                id: string;
                type: string;
            }[];
            fillings?: undefined;
        } | {
            id: string;
            type: string;
            name: string;
            ppu: number;
            batters: {
                batter: {
                    id: string;
                    type: string;
                }[];
            };
            topping: {
                id: string;
                type: string;
            }[];
            fillings: {
                filling: {
                    id: string;
                    name: string;
                    addcost: number;
                }[];
            };
        })[];
    };
};
