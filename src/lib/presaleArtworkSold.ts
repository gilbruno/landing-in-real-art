'use server'
import prisma from "./prisma"

async function fetchPresaleArtworkSold() {
    const list = await prisma.presaleArtowrkSold.findMany()
    return list

}