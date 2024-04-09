'use server'
import prisma from "./prisma"

async function fetchOrders() {
    const list = await prisma.presaleArtworkOrder.findMany()
    return list

}

async function fetchOrdersByOwner(owner_?: string | `0x${string}`) {
    const list = await prisma.presaleArtworkOrder.findMany(
        {
            where: {
                owner: owner_
            }
        }
    )
    return list
}


export {fetchOrders, fetchOrdersByOwner}