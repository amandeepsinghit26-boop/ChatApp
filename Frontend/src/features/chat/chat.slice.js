import {createSlice} from '@reduxjs/toolkit'

const chatSlice=createSlice({
    name:'chat',
    initialState:{
        chats:{},
        currentChatId:null,
        loading:false,
        error:null
    },
    reducers:{
        createNewChat:(state,action)=>{
        const {chatId,title}=action.payload
        state.chats[chatId]={ 
            title,
            messages:[],
            lastUpdated: new Date().toISOString()
        }
    },
addMessages:(state,action)=>{
const {chatId,messages}=action.payload
if (!state.chats[chatId]) {
    state.chats[chatId] = {
      title: 'New Chat',
        messages: [],
        lastUpdated: new Date().toISOString()
    }
  }
state.chats[chatId].messages.push(...messages)

},

    addNewMessage:(state,action)=>{
        const {chatId,content,role}=action.payload
         if (!state.chats[chatId]) {
    state.chats[chatId] = {
      title: 'New Chat',
      messages: [],
      lastUpdated: new Date().toISOString()
    }
  }
        state.chats[chatId].messages.push({id:Date.now(),content,role})
    },
        setChats:(state,action)=>{
            state.chats=action.payload
        },
        setCurrentChatId:(state,action)=>{
            state.currentChatId=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.error=action.payload
        }
    }
}) 

export const {setChats,setCurrentChatId,setLoading,setError,createNewChat,addNewMessage,addMessages}=chatSlice.actions
export default chatSlice.reducer