import { NextResponse, NextRequest } from "next/server";
import { __next_app__ } from "next/dist/build/templates/app-page";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });
import { Readable } from 'stream';

async function fetchRemoteImageAsBuffer(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}


function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);  // Push the buffer to the stream
  stream.push(null);    // Indicates that the stream is ended
  return stream;
}

export async function POST(request: NextRequest) {
  let res
  try {
    const imageObj = await request.json()
    console.log(imageObj)
    const artworkName = imageObj.artwork
    const imageBuffer = await fetchRemoteImageAsBuffer(imageObj.fileUrl);
    const stream = bufferToStream(imageBuffer);

    const options = {
      pinataMetadata: {
        name: artworkName,
      }
    };

    // Upload the file to IPFS via Pinata
    res = await pinata.pinFileToIPFS(stream, options);

    const { IpfsHash } = res;
    console.log('URL GATEWAY : ', process.env.NEXT_PUBLIC_GATEWAY_URL + IpfsHash)
    return NextResponse.json({ IpfsHash }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
