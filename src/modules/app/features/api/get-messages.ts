import env from "@/env";
import { getAxiosInstance } from "@/lib/api";

interface GetMessagesProps{
    id:string
    page:number,
    limit:number
}

type Attachment={
    downloadUrl:string
    fileId:string
    fileName:string
    fileSize:number
    previewUrl:string
    viewUrl:string
} | null

type Sender={
    id:string
    name:string
    profilePicture:string | null
}

export type Message={
    attachments:Attachment[]
    chatId:string
    content:string | null
    createdAt:Date
    id:string
    sender:Sender
}

export interface GetMessagesResponse {
    limit:number
    message:string
    messages:Message[],
    page:number
    status:boolean
    total:number
}

const url=`${env.EXPO_PUBLIC_BACKEND_API_URL}/chat/messages`

export const getMessagesAPI=async({id,limit,page}:GetMessagesProps)=>{
    const axiosInstance=getAxiosInstance()
    const response=await axiosInstance.get<GetMessagesResponse>(
        `${url}/${id}`,{
            params:{
                page,
                limit
            }
        }
    )
    return response.data
}

