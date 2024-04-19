import axios from 'axios';

export const pinJSONToIPFS = async (cid: string, tokenID: number) => {
  
  const data = JSON.stringify({
    pinataContent: {
      name: "IRA Order NFT",
      description: `Order IRA #${tokenID}`,
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


