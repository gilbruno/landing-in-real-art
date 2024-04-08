"use server"
import React from 'react'
import { fetchOrders } from '../../lib/presaleArtworkOrder'

          
const OrderCardDataServer = async () => {
    //Fetch in the Postgres Database
    const orders =  await fetchOrders()
    return (
        <div>OrderCardData</div>
    )
}

export default OrderCardDataServer
