import { useEffect, useState } from 'react';

export default function useOwnedNFTs(owner?: string, contract?: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<any[]>([]);

  useEffect(() => {
    if (!owner || !contract) return;
    setIsLoading(true);
    async function fetchData() {
      const requestHeaders: HeadersInit = {
        Accept: 'application/json',
        'X-API-KEY': process.env.OPENSEA_API_KEY ?? '',
      };

      const requestOptions: RequestInit = {
        method: 'GET',
        headers: requestHeaders,
      };

      try {
        const response = await fetch(
          `https://testnets-api.opensea.io/api/v1/assets?owner=${owner}&asset_contract_address=${contract}&order_direction=desc&offset=0&limit=20&include_orders=false`,
          requestOptions,
        );
        const { assets } = await response.json();
        setIsLoading(false);
        setTokens(assets);
      } catch (err) {
        setIsLoading(false);
        console.log(`Error fetching assets from Opensea: ${err}`);
        return new Error(`Error fetching assets from Opensea: ${err}`);
      }
    }
    fetchData();
  }, [owner, contract]);

  return { tokens, isLoading };
}
