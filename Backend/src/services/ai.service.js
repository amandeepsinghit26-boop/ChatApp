import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai"
import { HumanMessage ,SystemMessage,AIMessage,tool,createAgent} from "langchain";
import * as z from 'zod';
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatMistralAI({
model: 'gemini-flash-lite-latest',
apiKey: process.env.GEMINI_API_KEY
});

// gemini-2.5-flash-lite
const mistralModel=new ChatMistralAI({
model: 'mistral-small-latest',
apiKey: process.env.MISTRAL_API_KEY
})

const searchInternetTool=tool(searchInternet,{
name:"searchInternet",
description:"Use this tool to search the internet for relevant information to answer user queries. Input should be a search query string. The tool will return a list of search results, each containing a title, URL, and summary.",
schema: z.object({
query:z.string().describe("The search query string to look up on the internet.")
})

})

const agent=createAgent({
   model:geminiModel,
   tools:[searchInternetTool]

})

export async function generateResponse(messages) {
   const response=await agent.invoke(
 { messages: [
   new SystemMessage('  You are helpful and precise assistant for answering questions.
 ') ,...(messages.map(msg=>{
      if(msg.role==='user') {
        return new HumanMessage(msg.content)
      }
      else if(msg.role==='ai') {
        return new AIMessage(msg.content)
      }
   }))]}
   )
   return response.messages[response.messages.length-1].text
}

export async function generateChatTitle(message) {
   const response=await mistralModel.invoke([
      new SystemMessage("You are a helpful assistant that generates concise and relevant titles for user queries. Your task is to create a short title that captures the essence of the user's query, making it easy for users to understand the topic at a glance."),
      new HumanMessage(`Generate a concise title for the following user query: "${message}"`)
   ])
   return response.text
}


