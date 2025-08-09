import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { Text, View } from "react-native";
import { io } from "socket.io-client";

export default function TestScreen() {
	const [message, setMessage] = useState<string>("");
	const intervalRef = useRef<number | null>(null);

	useFocusEffect(
		useCallback(() => {
			const socket = io("http://10.0.2.2:8000", {
				autoConnect: true,
			});

			socket.on("connect", () => {
				console.log("Connected to server with ID:", socket.id);
			});

			socket.on("connect_error", (error) => {
				console.log("Connection error:", error);
			});

			socket.on("disconnect", () => {
				console.log("Disconnected, socket ID:", socket.id);
			});

			socket.on("hello", (data) => {
				console.log("Received hello:", data);
				setMessage(data);
			});

			// Send data every 300ms while connected
			intervalRef.current = setInterval(() => {
				socket.emit("data", "hi, server!");
			}, 300);

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}
				socket.disconnect();
			};
		}, []),
	);

	return (
		<View className="flex-1 bg-red-500 justify-center items-center">
			<Text className="text-white text-lg">
				{message ? `Server says: ${message}` : "Connecting..."}
			</Text>
		</View>
	);
}
