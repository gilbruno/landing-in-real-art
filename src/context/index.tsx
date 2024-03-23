"use client"
import React, { createContext, useContext, useState } from "react"

/**
 * Here is the main page of my context.
 * Language must be use as a global variale so in a React Context
 * By default the Language is 'EN'
 */
const AppContext = createContext<any>(undefined)

export function AppWrapper({ children }: {
    children: React.ReactNode
}) {

    let [lang, setLang] = useState('EN')

    return (
        <AppContext.Provider value={
            {
                lang, setLang
            }
        }>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}