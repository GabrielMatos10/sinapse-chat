import  React, {useEffect, useState} from 'react';
import {View, Image, Text, useWindowDimensions} from 'react-native'
import { Feather } from '@expo/vector-icons';
import { DataStore, Auth } from 'aws-amplify';
import { User, ChatRoomUser } from '../src/models';
import moment from 'moment';


const ChatRoomHeader = ({id, children}) => {
    const {width} = useWindowDimensions()

    const [user, setUser] = useState<User|null>(null)

    useEffect(() => {
      if(!id){
        return
      }
        const fetchUsers = async () => {
          const fetchedUsers = await (await DataStore.query(ChatRoomUser))
          .filter(chatRoomUser => chatRoomUser.chatRoom.id === id)
          .map(chatRoomUser => chatRoomUser.user)
          // setUsers(fetchedUsers)
  
          const authUser = await Auth.currentAuthenticatedUser()
          setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null)
        }
        fetchUsers()
      }, [])

      const getLastOnlineText = () => {
        if(!user?.LastOnlineAt){
          return null;
        }
        const lastOnlineDiffMS =  moment().diff(moment(user.LastOnlineAt))
        if( lastOnlineDiffMS < 5 * 60 * 1000) {
          return "online"
        } else {
          return `Última vez online ${moment(user.LastOnlineAt).fromNow()}`
        }
      }
  
    return(
      <View style={{
        flexDirection: 'row', 
        justifyContent: 
        'space-between', 
        width: width - 60,
        padding: 10,
        alignItems: 'center',
        }}>
        <Image 
        source={{uri: user?.imageUri, }}
        style={{width: 30, height: 30, borderRadius: 30,}}
        />
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={{flex: 1, marginLeft:5, fontSize: 18, fontWeight: 'bold'}}> 
          {user?.name} 
          </Text>
          <Text>{getLastOnlineText()}</Text>
        </View>

        <Feather 
        name="camera" 
        size={24} 
        color="grey" 
        style={{ marginHorizontal: 10}} 
        />
        <Feather 
        name="edit" 
        size={24} 
        color="grey" 
        style={{ marginHorizontal: 10}} 
        />
      </View>
    )
  }
  
  export default ChatRoomHeader