import { View,type ViewProps } from "react-native"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

interface InputAreaProps extends ViewProps {
    handleSendMessage:(message:string)=>void
}

export function InputArea({handleSendMessage,className,...props}:InputAreaProps){
   const [inputMessage,setInputMessage]=useState("")

    const submitMessage=()=>{
        handleSendMessage(inputMessage)
        setInputMessage("")
    }

    return(
                <View className={cn("flex-row items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-black",className)} {...props}>
                    <Input
                        placeholder="Type a message..."
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        className="flex-1 mr-3"
                        returnKeyType="send"
                    />
                    <Button
                        onPress={submitMessage}
                        className="bg-blue-500 px-4 py-2 rounded-full"
                    >
                        <Text className="text-white font-medium">Send</Text>
                    </Button>
                </View>
    )
}