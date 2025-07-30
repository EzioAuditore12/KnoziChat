import { useAssets } from "expo-asset";

interface getLocalAssetsProps{
    Assets:any[]
}

export function getLocalAssets({Assets}:getLocalAssetsProps) {
    const [assets, error] = useAssets(Assets);

    if (assets && !error) {
        return assets.map(asset => ({
            uri: asset.uri,
            name: asset.name,
            type: asset.type,
        }));
    }

return null

}