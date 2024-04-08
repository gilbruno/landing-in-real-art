"use client"
import React, { ReactNode } from 'react'

interface ChildenProps {
    children: ReactNode
}
const OrderCardDataClient = ({children}: ChildenProps) => {
  return (
    <>
        {children}
    </>
  )
}

export default OrderCardDataClient