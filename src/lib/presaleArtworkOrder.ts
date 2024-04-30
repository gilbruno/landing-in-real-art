'use server'
import { CreateOrder, PresaleOrder, UpdateOrder } from "@/types/db-types"
import prisma from "./prisma"
import { Lang as DbLang, ResourceNftStatus } from "@prisma/client"

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


//------------------------------------------------------------------------------ createOrder
/**
 * 
 * @param data_ 
 * @returns 
 */
async function createOrder(data_: CreateOrder) {
    const { owner, artistName, artworkName, price, offerNumber, status, imageUri, gatewayImageUri, lang } = data_
    const order = await prisma.presaleArtworkOrder.create({
        data: {
            owner: owner,
            artistName: artistName,
            artworkName: artworkName,
            price: Number(price),
            offerNumber: offerNumber,
            status: ResourceNftStatus.UPLOADIPFS,
            imageUri: imageUri,
            gatewayImageUri: gatewayImageUri,
            lang: lang

        },
    })
    return order
}

//------------------------------------------------------------------------------ insertPresaleTable
const insertPresaleOrder = async (ipfsHash: string, userPublicKey: string, artistName: string, artworkName: string, offerNumber: string, offerPrice: number, lang: string) => {
    const pKey = userPublicKey as string
    let dbLang = await matchDbLang(lang) as DbLang
    const data =
        { 
            artistName: artistName,
            artworkName: artworkName,
            owner: pKey,
            offerNumber: Number(offerNumber),
            price: offerPrice,
            status: ResourceNftStatus.UPLOADIPFS,
            imageUri: ipfsHash,
            gatewayImageUri: process.env.NEXT_PUBLIC_GATEWAY_URL + ipfsHash,
            lang: dbLang
        }
    const order = await createOrder(data)
    return order
    // if (error?.code == CODE_UNIQUE_KEY_VIOLATION) {
    //     msgError = 'This email already exists in our e-mail base'    
    // }
    // else {
    //     if (error) throw error  
    // }
    // return msgError
}

//------------------------------------------------------------------------------ createPresaleOrder
const createPresaleOrder = async (order_: PresaleOrder) => {
    const order = await prisma.presaleArtworkOrder.create({
        data: {
            owner: order_.owner,
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
            lang: order_.lang
        }
    })
    return order
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
export { fetchOrders, fetchOrdersByOwner, fetchOrdersByUniqueKey, fetchOrderByHashArtwork, updateOrderByUniqueKey, 
    createOrder, insertPresaleOrder, createPresaleOrder, updatePresaleOrder, updateOrder, updateTokenIdPresaleOrder, matchDbLang }

