import { CategoriesResponse, ImagesResponse, ProductsResponse, ProductVariantsResponse, SeriesResponse } from "./pocketbase"

export interface SummaryResType {
    seriesList: {
        id: string
        title: string
    }[]
    categoryList: {
        id: string
        title: string
    }[]
    tagList: {
        tag: string
    }[]
}

export type TexpandProductListResType = ProductsResponse & {
    expand: {
        categories?: CategoriesResponse;
        series?: SeriesResponse;
        images?: ImagesResponse[];
        productVariants_via_products?: ProductVariantsResponse[]
    };
};

export interface Option {
    value: string;
    label: string;
}