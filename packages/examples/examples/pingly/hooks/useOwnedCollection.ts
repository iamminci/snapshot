import { useEffect, useState } from 'react';

export default function useOwnedCollections(owner?: string) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    if (!owner) return;
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
          `https://testnets-api.opensea.io/api/v1/collections?asset_owner=${owner}&offset=0&limit=300`,
          requestOptions,
        );
        const data = await response.json();

        const filteredCollection = data.filter((collection: any) => {
          return (
            !collection.name.includes('CommunityNFT') &&
            !collection.name.includes('EcoSoul') &&
            !collection.name.includes('Arctic') &&
            !collection.name.includes('Plastic') &&
            !collection.name.includes('SZNouns') &&
            !collection.name.includes('Faucet')
          );
        });

        setIsLoading(false);
        setCollections(filteredCollection);
      } catch (err) {
        setIsLoading(false);
        console.log(`Error fetching assets from Opensea: ${err}`);
        return new Error(`Error fetching assets from Opensea: ${err}`);
      }
    }
    fetchData();
  }, [owner]);

  return { collections, isLoading };
}
