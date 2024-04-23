import axios from 'axios';
import { Keccak } from 'sha3';

export const pinJSONToIPFS = async (cid: string, artistName: string, artworkName: string) => {
  console.log("CID :", cid)

  const hashArtworkString = `artistName${artistName}|${artworkName}`
  let hashArtwork = new Keccak(256)
  hashArtwork.update(hashArtworkString)
  hashArtwork.digest('hex')

  const data = JSON.stringify({
    pinataContent: {
      name: "IRA Order NFT",
      description: `Order IRA "${hashArtwork}`,
      external_url: "",
      image: `ipfs://${cid}`
    },
    pinataMetadata: {
      name: "metadata.json"
    }
  })
  
    try{
        const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.PINATA_JWT
        }
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
}


