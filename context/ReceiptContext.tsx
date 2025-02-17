// ReceiptContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

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

interface ReceiptContextType {
    people: Person[];
    setPeople: React.Dispatch<React.SetStateAction<Person[]>>;
    items: ReceiptItem[];
    setItems: React.Dispatch<React.SetStateAction<ReceiptItem[]>>;
    assignments: Assignment;
    setAssignments: React.Dispatch<React.SetStateAction<Assignment>>;
}

const ReceiptContext = createContext<ReceiptContextType | undefined>(undefined);

export const ReceiptProvider = ({ children }: { children: ReactNode }) => {
    const [people, setPeople] = useState<Person[]>([]);
    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [assignments, setAssignments] = useState<Assignment>({});

    const value = {
        people,
        setPeople,
        items,
        setItems,
        assignments,
        setAssignments,
    };

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
