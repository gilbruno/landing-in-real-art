import { NextResponse, NextRequest } from "next/server"
import fs from 'fs'
import * as path from 'path'
import { __next_app__ } from "next/dist/build/templates/app-page"
import { updateTokenIdPresaleOrder } from "@/lib/presaleArtworkOrder"
const pinataSDK = require("@pinata/sdk")
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

export async function GET() {
  return NextResponse.json({
    hello: "files"
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const functionName = data.functionName

    let response
    if (functionName === 'updateTokenIdPresaleOrder') {
        const idOrder = data.idOrder
        const tokenId = data.tokenId
        response = await updateTokenIdPresaleOrder(idOrder, tokenId)
    }
    return NextResponse.json({ OK: 'OK' }, { status: 200 })

    //return response
  } catch (e) {
    console.log(e)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
