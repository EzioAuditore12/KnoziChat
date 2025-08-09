import env from "@/env";
import { type ReactNode, createContext, useContext, useMemo, useEffect } from "react";
import io from "socket.io-client";
import { authStore } from "@/store";

const SocketContext = createContext<ReturnType<typeof io> | null>(null);

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { tokens } = authStore.getState();
    
    const socket = useMemo(() => {
        if (!tokens?.accessToken) return null;
        
        const socketInstance = io(env.EXPO_PUBLIC_BACKEND_API_URL, { 
            extraHeaders: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });

        // Handle token expiration
        socketInstance.on('connect_error', async (error) => {
            if (error.message === 'TOKEN_EXPIRED') {
                console.log('Token expired, refreshing...');
                
                try {
                    // Call your refresh token API
                    const response = await fetch(`${env.EXPO_PUBLIC_BACKEND_API_URL}/api/auth/regenerate-tokens`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            refreshToken: tokens.refreshToken
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        
                        // Update tokens in your store
                        authStore.setState({
                            tokens: {
                                accessToken: data.accessToken,
                                refreshToken: data.refreshToken
                            }
                        });
                        
                        // Update socket connection with new token
                        if (socketInstance.io.opts.extraHeaders) {
                            socketInstance.io.opts.extraHeaders.Authorization = `Bearer ${data.accessToken}`;
                        }
                        socketInstance.connect();
                    } else {
                        // Refresh failed, clear tokens and redirect
                        authStore.setState({ tokens: undefined });
                        // Handle logout/redirect logic here
                    }
                } catch (err) {
                    console.error('Token refresh failed:', err);
                    authStore.setState({ tokens: undefined});
                    // Handle logout/redirect logic here
                }
            }
        });

        return socketInstance;
    }, [tokens?.accessToken]); // Add accessToken as dependency

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            socket?.disconnect();
        };
    }, [socket]);

    return (
        <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    );
};

export default SocketProvider;
export { getSocket };