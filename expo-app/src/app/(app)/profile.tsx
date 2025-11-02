import { Box } from "@/components/ui/box";
import { useGetProfile } from "@/features/app/user/hooks/use-get-profile";

export default function ProfileScreen(){

    const {data} = useGetProfile()

    console.log(data)

    return(
        <Box className="flex-1 bg-red-500">
            
        </Box>
    )
}