import React, { createContext, useContext, ReactNode } from "react";

// Define the shape of the context
interface ConsortiumDetailsContextType {
    refetch: () => void;
}

// Create the context with a default value
const ConsortiumDetailsContext = createContext<ConsortiumDetailsContextType | undefined>(undefined);

// Custom hook to use the context
export const useConsortiumDetailsContext = () => {
    const context = useContext(ConsortiumDetailsContext);
    if (!context) {
        throw new Error("useConsortiumDetailsContext must be used within a ConsortiumDetailsProvider");
    }
    return context;
};

// Provider component that will wrap the application or component tree
interface ConsortiumDetailsProviderProps {
    children: ReactNode;
    refetch: () => void; // Pass refetch function as a prop
}

export const ConsortiumDetailsProvider = ({ children, refetch }: ConsortiumDetailsProviderProps) => {
    return (
        <ConsortiumDetailsContext.Provider value={{ refetch }}>
            {children}
        </ConsortiumDetailsContext.Provider>
    );
};
