import { NextResponse, NextRequest } from "next/server";
import fs from 'fs'
import * as path from 'path';
import { __next_app__ } from "next/dist/build/templates/app-page";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export async function GET() {
  return NextResponse.json({
    hello: "files"
  })
}

export async function POST(request: NextRequest) {
  try {
    const orderFileName = '/public/img/logo-IRA.png'
    const orderFilePath = path.join(process.cwd() + orderFileName);
    const stream = fs.createReadStream(orderFilePath);
    const options = {
      pinataMetadata: {
        name: 'logo-IRA.png',
      },
    };
    const response = await pinata.pinFileToIPFS(stream, options);
    const { IpfsHash } = response;
    console.log('URL GATEWAY : ', process.env.NEXT_PUBLIC_GATEWAY_URL +  IpfsHash)
    return NextResponse.json({ IpfsHash }, { status: 200 });
    //return response;
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
