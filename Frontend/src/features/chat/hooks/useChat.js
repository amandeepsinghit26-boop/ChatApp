import { initalizeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import { useDispatch } from "react-redux";
import {
  createNewChat,
  addNewMessage,
  addMessages,
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    try {
      const data = await sendMessage({ message, chatId });
      const { userMessage, aiMessage, chat } = data;
      const finalChatId = chat?._id || chatId;

      if (!finalChatId) {
        console.error('Cannot send message: missing chat id');
        return;
      }

      if (chat && !chatId) {
        dispatch(
          createNewChat({
            chatId: finalChatId,
            title: chat.title,
          }),
        );
      }

      dispatch(setCurrentChatId(finalChatId));

      dispatch(
        addNewMessage({
          chatId: finalChatId,
          content: message,
          role: 'user',
        }),
      );

      if (aiMessage) {
        dispatch(
          addNewMessage({
            chatId: finalChatId,
            content: aiMessage.content,
            role: aiMessage.role,
          }),
        );
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function fetchChats() {
dispatch(setLoading(true));
try {
  const data=await getChats()
  const { chats } = data;
  dispatch(setChats(chats.reduce((acc, chat) => {
    acc[chat._id] = {
id: chat._id,
title: chat.title,
messages: chat.messages || [],
lastUpdated: chat.updatedAt,
    }

    
    dispatch(addMessages({ chatId: chat._id, messages: chat.messages || [] }))
    return acc
    
}, {})));

} catch (error) {
  dispatch(setError(error.message));
} finally {
  dispatch(setLoading(false));
}
  }

async function handleOpenChat(chatId,chats) {
  if (!chatId) {
    console.error("chatId is undefined ❌")
    return
  }
console.log(chats[chatId]?.messages.length);

if (!chats[chatId]?.messages || chats[chatId]?.messages.length === 0) {
  const data = await getMessages(chatId);
  const { messages } = data;
  const formattedMessages = messages.map((msg) => ({
    id: msg._id,
    content: msg.content,
    role: msg.role,
  }));
  dispatch(addMessages({ chatId, messages: formattedMessages })
  );
}
  dispatch(setCurrentChatId(chatId));

}

  return {
    initalizeSocketConnection,
    handleSendMessage,
    fetchChats,
    handleOpenChat,
  };
};
