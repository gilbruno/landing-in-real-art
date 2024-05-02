'use server'
import { BuyerPresale, CreateOrder, PresaleOrder, UpdateOrder } from "@/types/db-types"
import prisma from "./prisma"
import { Lang as DbLang, ResourceNftStatus } from "@prisma/client"
import { Address } from "viem"

//------------------------------------------------------------------------------ fetchOrders
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

//------------------------------------------------------------------------------ fetchBuyerInfosByPublicKey
async function fetchBuyerInfosByPublicKey(publicKey: Address) {
    const pKey = publicKey as string
    const buyer = await prisma.buyerPresale.findUnique(
        {
            where: {
                publicKey: pKey
            }
        }
    )
    return buyer

}

//------------------------------------------------------------------------------ fetchOrdersByUniqueKey
/**
 * Fetch presale orders by owner, artistName, artworkName, offernumber
 * @param owner_ 
 * @returns 
 */
async function fetchOrdersByUniqueKey(owner_: string | `0x${string}`, artistName_: string, artworkName_: string, offernumber_: number) {
    const order = await prisma.presaleArtworkOrder.findFirst(
        {
            where: {
                owner: owner_,
                artistName: artistName_,
                artworkName: artworkName_,
                offerNumber: offernumber_
            }
        }
    )
    return order
}

/**
 * Fetch presale orders by owner, artistName, artworkName, offernumber
 * @param owner_ 
 * @returns 
 */
async function fetchOrderByHashArtwork(hashArtwork_: string) {
    const order = await prisma.presaleArtworkOrder.findFirst(
        {
            where: {
                hashArt: hashArtwork_
            }
        }
    )
    return order
}


//------------------------------------------------------------------------------ createPresaleOrder
const createPresaleOrder = async (order_: PresaleOrder) => {
    const order = await prisma.presaleArtworkOrder.create({
        data: {
            owner: order_.owner,
            txHash: order_.txHash,
            artistName: order_.artistName,
            artworkName: order_.artworkName,
            hashArt: order_.hashArt,
            tokenId: order_.tokenId,
            price: Number(order_.price),
            offerNumber: order_.offerNumber,
            status: order_.status,
            imageUri: order_.imageUri,
            gatewayImageUri: order_.gatewayImageUri,
            metadataUri: order_.metadataUri,
            gatewayMetadataUri: order_.gatewayMetadataUri,
            collectionName: order_.collectionName,
            collectionSymbol: order_.collectionSymbol,
            lang: order_.lang,
            contractAddress: order_.contractAddress
        }
    })
    return order
}

//------------------------------------------------------------------------------ upsertBuyerPresale
const upsertBuyerPresale = async (buyer_: BuyerPresale) => {
    const buyer = await prisma.buyerPresale.upsert({
        where: {
          publicKey: buyer_.publicKey,
        },
        update: {
          firstName: buyer_.firstName,
          lastName: buyer_.lastName,
          address: buyer_.address,
          phone: buyer_.phone,
          email: buyer_.email
        },
        create: {
            publicKey: buyer_.publicKey,
            firstName: buyer_.firstName,
            lastName: buyer_.lastName,
            address: buyer_.address,
            phone: buyer_.phone,
            email: buyer_.email
        },
      })
    return buyer  
}

//------------------------------------------------------------------------------ updatePresaleOrder
const updatePresaleOrder = async (idOrder: number, ipfsMetadataHash: string) => {
    const gatewayMetadataUri = process.env.NEXT_PUBLIC_GATEWAY_URL as string + ipfsMetadataHash
    const dataToUpdate =
        { 
            status: ResourceNftStatus.UPLOADMETADATA,
            metadataUri: ipfsMetadataHash,
            gatewayMetadataUri: gatewayMetadataUri
        }
    await updateOrder(idOrder, dataToUpdate)
}

//------------------------------------------------------------------------------ updateTokenIdPresaleOrder
const updateTokenIdPresaleOrder = async (idOrder: number, tokenId: number) => {
    const dataToUpdate =
        { 
            tokenId: tokenId
        }
    await updateOrder(idOrder, dataToUpdate)
}

//------------------------------------------------------------------------------ updateOrder
async function updateOrder(idOrder: number, data_: Partial<UpdateOrder>) {
    const { status, metadataUri, gatewayMetadataUri } = data_
    await prisma.presaleArtworkOrder.update({
        where: {
            id: idOrder
        },
        data: {
            status: status,
            metadataUri: metadataUri,
            gatewayMetadataUri: gatewayMetadataUri
        }
    })
}

/**
 * 
 * @param owner_ 
 * @param artistName_ 
 * @param artworkName_ 
 * @param offernumber_ 
 * @param dataToUpdate 
 */
async function updateOrderByUniqueKey(owner_: string | `0x${string}`, artistName_: string, artworkName_: string, offernumber_: number, dataToUpdate: any) {
    await prisma.presaleArtworkOrder.updateMany(
        {
            where: {
                owner: owner_,
                artistName: artistName_,
                artworkName: artworkName_,
                offerNumber: offernumber_
            },
            data: dataToUpdate
        }
    )

}

async function matchDbLang(lang_: string) {
    let dbLang: DbLang
    switch (lang_) {
        case 'CN':
            dbLang = DbLang.CN
            return dbLang
        case 'EN':
            dbLang = DbLang.EN
            return dbLang
        case 'FR':
            dbLang = DbLang.FR
            return dbLang
    }
}
export { fetchOrders, fetchOrdersByOwner, fetchOrdersByUniqueKey, fetchOrderByHashArtwork, fetchBuyerInfosByPublicKey, updateOrderByUniqueKey, 
    upsertBuyerPresale, createPresaleOrder, updatePresaleOrder, updateOrder, updateTokenIdPresaleOrder, matchDbLang }

