import { Button, type ButtonProps } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface PassKeyLoginProps extends ButtonProps {
	className?: string;
}

export function PassKeyLogin({ className,...props }: PassKeyLoginProps) {
	return (
		<Button 
        className={cn("px-4 w-full rounded-2xl", className)}
        {...props}
        >
			<Text>Sign In With Pass Key</Text>
		</Button>
	);
}
