import { isClerkAPIResponseError, useSignIn, useSSO } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { maybeCompleteAuthSession } from "expo-web-browser";
import { useState } from "react";
import {makeRedirectUri} from "expo-auth-session"

maybeCompleteAuthSession();

export function LoginHook() {
	const { startSSOFlow } = useSSO();
	const [errors, setErrors] = useState<ClerkAPIError[] | string>([]);
    const {setActive,signIn}=useSignIn()

	const handleSignInWithGoogle = async () => {
		try {
			const {createdSessionId,setActive}=await startSSOFlow({
                strategy:"oauth_google",
                redirectUrl:makeRedirectUri()
            })

            if(createdSessionId){
                setActive!({session:createdSessionId})
            }
            else{
                setErrors("There is no session")
            }


		} catch (error) {
			if (isClerkAPIResponseError(error)) {
				setErrors(error.errors);
			} else {
				setErrors("Something Went Wrong");
			}
		}
	};

	const handleSignInWithPassKey = async () => {
        try {
			const signInAttempt=await signIn?.authenticateWithPasskey({
                flow:"discoverable"
            })

            if(signInAttempt?.status==="complete"){
                await setActive!({session:signInAttempt.createdSessionId})
            }else{
                setErrors("Unable to do login with passkey")
            }

		} catch (error) {
			if (isClerkAPIResponseError(error)) {
				setErrors(error.errors);
			} else {
				setErrors("Something Went Wrong");
			}
		}
    };

	return {
		error: errors,
        googleSignIn:handleSignInWithGoogle,
        passKeySignIn:handleSignInWithPassKey
	};
}
