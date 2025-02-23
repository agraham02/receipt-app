// ReceiptContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

const fakePeople: Person[] = [
    { id: "1", name: "Alice" },
    { id: "2", name: "Bob" },
    { id: "3", name: "Charlie" },
    { id: "4", name: "Derik" },
    { id: "5", name: "Emma" },
];

const fakeItems: ReceiptItem[] = [
    // Individual entrees ordered by different people
    { id: "a", name: "Margherita Pizza", price: 13.99 },
    { id: "b", name: "Spaghetti Carbonara", price: 15.99 },
    { id: "c", name: "Fettuccine Alfredo", price: 16.5 },

    // Shared appetizers
    { id: "d", name: "Garlic Bread (Shared Appetizer)", price: 7.99 },
    { id: "e", name: "Bruschetta (Shared Appetizer)", price: 9.99 },

    // Drinks (individual or shared)
    { id: "f", name: "Bottle of House Red Wine (Shared)", price: 34.99 },
    { id: "g", name: "Sparkling Water", price: 4.5 },

    // Shared dessert
    { id: "h", name: "Tiramisu (Shared Dessert)", price: 8.99 },

    // Additional drink option
    { id: "i", name: "Espresso", price: 3.0 },
];

export interface Person {
    id: string;
    name: string;
}

export interface ReceiptItem {
    id: string;
    name: string;
    price: number;
}

export interface Assignment {
    // Mapping from item ID to an array of person IDs
    [itemId: string]: string[];
}

export type TipMode = "percentage" | "fixed";

interface ReceiptContextType {
    people: Person[];
    setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
    items: ReceiptItem[];
    setItems: React.Dispatch<React.SetStateAction<ReceiptItem[]>>;
    assignments: Assignment;
    setAssignments: React.Dispatch<React.SetStateAction<Assignment>>;
    subtotal: number;
    setSubtotal: React.Dispatch<React.SetStateAction<number>>;
    tip: number;
    setTip: React.Dispatch<React.SetStateAction<number>>;
    tax: number;
    setTax: React.Dispatch<React.SetStateAction<number>>;
    tipMode: TipMode;
    setTipMode: React.Dispatch<React.SetStateAction<TipMode>>;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
    const [people, setPeople] = useState<Person[]>(fakePeople);
    const [items, setItems] = useState<ReceiptItem[]>(fakeItems);
    const [assignments, setAssignments] = useState<Assignment>({});
    const [subtotal, setSubtotal] = useState<number>(
        fakeItems.reduce((sum, item) => sum + item.price, 0)
    );
    const [tip, setTip] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const [tipMode, setTipMode] = useState<TipMode>("percentage");

    const value = useMemo(() => ({
        people,
        setPeople,
        items,
        setItems,
        assignments,
        setAssignments,
        subtotal,
        setSubtotal,
        tip,
        setTip,
        tax,
        setTax,
        tipMode,
        setTipMode,
    }), [people, items, assignments, subtotal, tip, tax, tipMode]);

    return (
        <ReceiptContext.Provider value={value}>
            {children}
        </ReceiptContext.Provider>
    );
};

export const useReceipt = () => {
    const context = useContext(ReceiptContext);
    if (!context) {
        throw new Error("useReceipt must be used within a ReceiptProvider");
    }
    return context;
};
