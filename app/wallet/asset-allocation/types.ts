export type AssetClassName = "Equity" | "Debt" | "Cash" | "Gold" | "Silver";

export interface AssetDetail {
    name: string;
    allocation: number;
}

export interface AssetClass {
    type: AssetClassName;
    allocation: number;
    assets: AssetDetail[];
}

export interface AllocationBucket {
    bucketName: string;
    classes: AssetClass[];
}

export interface PortfolioSchema {
    version: string;
    lastUpdated: string;
    buckets: AllocationBucket[];
}

export interface AllocationRow {
    id: string;
    bucketName: string;
    assetClass: string;
    assetClassDistribution: number;
    assetName: string;
    assetDistribution: number;
    globalWeight: number;
}
