import { useAssets } from "expo-asset";

interface getLocalAssetsProps {
	Assets: any[];
}

export function getLocalAssets({ Assets }: getLocalAssetsProps) {
	const [assets, error] = useAssets(Assets);

	if (assets && !error) {
		return assets.map((asset) => ({
			uri: asset.localUri,
			name: asset.name,
			type: `image/${asset.type}`,
		}));
	}

	return null;
}
