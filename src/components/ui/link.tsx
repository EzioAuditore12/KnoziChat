import { Link as ExpoLink, type LinkProps as ExpoLinkProps } from "expo-router";

type LinkProps = ExpoLinkProps;

export const Link = ({ className, href, ...props }: LinkProps) => {
	return (
		<ExpoLink href={href} className="text-black dark:text-white" {...props} />
	);
};
