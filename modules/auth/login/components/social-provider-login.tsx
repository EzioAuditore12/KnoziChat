import { Stack } from "@/components/ui/layout";
import { SocialProviderButton } from "@/modules/auth/components/social-provider-button";
import { GoogleIcon } from "@/modules/auth/icons/google";
import type { ButtonProps } from "@/components/ui/button";

interface SocialProviderLoginProps extends ButtonProps {
    className?:string
}

export function SocialProviderLogin({className,...props}:SocialProviderLoginProps) {
	return (
		<SocialProviderButton
			providerIcon={GoogleIcon}
			className="bg-white w-full shadow-2xl"
			textColor="black"
			providerName="Google"
            {...props}
		/>
	);
}
