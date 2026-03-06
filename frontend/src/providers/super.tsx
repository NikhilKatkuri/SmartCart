"use client"

import useProduct from "@/hooks/product";
import { product } from "@/types"
import { createContext, useContext, useState } from "react"


interface SuperContextValue {
    // Define any values or functions you want to provide to the context here
    products: product[] | null;

}

interface SuperProviderProps {
    children: React.ReactNode
}

const SuperContext = createContext<SuperContextValue | undefined>(undefined)

const SuperProvider: React.FC<SuperProviderProps> = ({ children }) => {
 
    const contextValue: SuperContextValue = {
        // Initialize any values or functions you want to provide to the context here
        products: useProduct().products
    }

    return (
        <SuperContext.Provider value={contextValue}>
            {children}
        </SuperContext.Provider>
    )
}

const useSuperContext = (): SuperContextValue => {
    const context = useContext(SuperContext)
    if (context === undefined) {
        throw new Error("useSuperContext must be used within a SuperProvider")
    }
    return context
}

export { SuperContext, SuperProvider, useSuperContext }