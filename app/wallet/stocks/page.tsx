"use client";

import DataGrid from "@/app/components/Tables/DataGrid";
import { Column } from "@/app/types";

export interface Stock {
    id: string;
    name: string;
    symbol: string;
    sector: string;
    price: number;
    change: number;
    avgCost: number;
    quantity: number;
    value: number;
}

export default function StocksPage() {
    const columns: Column<Stock>[] = [
        { header: 'Ticker', accessor: 'symbol', width: 100 },
        {
            header: 'Price',
            accessor: 'price',
            editable: true,
            sortable: true,
            filterable: true,
            onCellSave: (newVal, stock) => {
                const numericValue = parseFloat(String(newVal));
                if (isNaN(numericValue)) return;
                stock.price = numericValue;
                console.log(`Update ${stock.symbol} to ${newVal}`);
            }
        },
        {
            header: 'Trend',
            accessor: 'change',
            sortable: true,
            filterable: true,
            render: (val) => <span className={parseFloat(String(val)) > 0 ? "text-green-500" : "text-red-500"}>{val}%</span>
        }
    ];

    const MOCK_STOCKS = [
        {
            id: "s1",
            name: "Reliance Industries",
            symbol: "RELIANCE",
            sector: "Energy",
            price: 2985.40,
            change: +1.45,
            avgCost: 2450.00,
            quantity: 15,
            value: 44781.00
        },
        {
            id: "s2",
            name: "HDFC Bank",
            symbol: "HDFCBANK",
            sector: "Banking",
            price: 1442.10,
            change: -0.82,
            avgCost: 1510.00,
            quantity: 50,
            value: 72105.00
        },
        {
            id: "s3",
            name: "Tata Consultancy Services",
            symbol: "TCS",
            sector: "IT Services",
            price: 4120.00,
            change: +0.25,
            avgCost: 3200.00,
            quantity: 10,
            value: 41200.00
        },
        {
            id: "s4",
            name: "Zomato Ltd",
            symbol: "ZOMATO",
            sector: "Consumer Tech",
            price: 182.45,
            change: +4.12,
            avgCost: 95.00,
            quantity: 200,
            value: 36490.00
        },
        {
            id: "s5",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s6",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s7",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s8",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s9",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s10",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s11",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s12",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s13",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s14",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s15",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s16",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s17",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        },
        {
            id: "s18",
            name: "Infosys",
            symbol: "INFY",
            sector: "IT Services",
            price: 1610.30,
            change: -1.40,
            avgCost: 1720.00,
            quantity: 25,
            value: 40257.50
        }
    ];

    return (
        <DataGrid data={MOCK_STOCKS}
            columns={columns}
            showRowNumbers
            enableSelection
        />
    );
}