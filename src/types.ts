export interface ProcessEnv {
    [key: string]: string | undefined;
}

// T Shirt Sizes
export const S = "S";
export const M = "M";
export const L = "L";
export const XL = "XL";
export const XXL = "XXL";
export const XXXL = "XXXL";

export const tShirtSizes = [S, M, L, XL, XXL, XXXL];

export type TShirtSizeType =
    | typeof S
    | typeof M
    | typeof L
    | typeof XL
    | typeof XXL
    | typeof XXXL;
