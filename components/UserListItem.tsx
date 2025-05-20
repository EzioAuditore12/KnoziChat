import {View,Text} from 'react-native'

const UserListItem=({user})=>{
    return(
        <View className="p-2 bg-white mt-2 rounded-2xl">
            <Text className='font-bold text-2xl'>{user.full_name}</Text>
        </View>
    )
}

export default UserListItem