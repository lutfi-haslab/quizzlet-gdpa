"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  PanelLeftIcon as SidebarRight,
  PlusCircle,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";

export default function ChatInterfaceComponent() {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "General Chat",
      messages: [
        { role: "user", content: "Hello! How can you help me today?" },
        {
          role: "assistant",
          content:
            "Hello! I'm here to assist you with any questions or tasks may have. How can I help today?",
        },
        { role: "user", content: "Hello! How can you help me today?" },
        {
          role: "assistant",
          content:
            "Hello! I'm here to assist you with any questions or tasks may have. How can I help today?",
        },
        { role: "user", content: "Hello! How can you help me today?" },
        {
          role: "assistant",
          content:
            "Hello! I'm here to assist you with any questions or tasks may have. How can I help today?",
        },
        { role: "user", content: "Hello! How can you help me today?" },
        {
          role: "assistant",
          content:
            "Hello! I'm here to assist you with any questions or tasks may have. How can I help today?",
        },
        { role: "user", content: "Hello! How can you help me today?" },
        {
          role: "assistant",
          content:
            "Hello! I'm here to assist you with any questions or tasks may have. How can I help today?",
        },
        { role: "user", content: "Hello! How can you help me today?" },
        {
          role: "assistant",
          content:
            "Hello! I'm here to assist you with any questions or tasks may have. How can I help today?",
        },
      ],
    },
    {
      id: 2,
      name: "Document Analysis",
      messages: [
        { role: "user", content: "Can you summarize this document for me?" },
        {
          role: "assistant",
          content:
            "I'd be happy to summarize the document for you. Could you please upload or provide you'd like me analyze?",
        },
      ],
    },
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedDocument, setSelectedDocument] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const addNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      name: `New Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  };

  const sendMessage = () => {
    if (inputMessage.trim() === "") return;
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [...chat.messages, { role: "user", content: inputMessage }],
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setInputMessage("");
    // Here you would typically send the message to your AI backend and handle the response
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex h-[85vh]">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ChatAI Interface</h1>
          <div className="flex space-x-2">
            <Button onClick={addNewChat}>
              <PlusCircle className="mr-2 h-4 w-4" /> New Chat
            </Button>
            <Button
              onClick={toggleSidebar}
              variant="outline"
              aria-label={isSidebarVisible
                ? "Hide chat history"
                : "Show chat history"}
            >
              <SidebarRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex space-x-4 mb-4">
          <Select value={selectedDocument} onValueChange={setSelectedDocument}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Document" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="doc1">Document 1</SelectItem>
              <SelectItem value="doc2">Document 2</SelectItem>
              <SelectItem value="doc3">Document 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt3">GPT-3</SelectItem>
              <SelectItem value="gpt4">GPT-4</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ScrollArea className="flex-1 bg-white rounded-lg shadow-inner p-4 mb-4">
          {chats.find((chat) => chat.id === activeChat)?.messages.map((
            message,
            index,
          ) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex items-start ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.role === "user" ? "U" : "AI"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.role === "user" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Upload className="h-4 w-4" />
          </Button>
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1"
          />
          <Button onClick={sendMessage}>
            <Send className="mr-2 h-4 w-4" /> Send
          </Button>
        </div>
      </div>

      {/* Floating Right Sidebar */}
      {isSidebarVisible && (
        <div className="w-64 bg-white shadow-lg p-4 overflow-y-auto fixed right-0 top-0 bottom-0 transition-transform duration-300 ease-in-out transform translate-x-0">
          <div className="flex justify-between flex-row items-center mb-4">
            <h2 className="text-lg font-semibold">Chat History</h2>
            <Button
              onClick={toggleSidebar}
              variant="outline"
              className="flex justify-center items-center"
              aria-label={isSidebarVisible
                ? "Hide chat history"
                : "Show chat history"}
            >
              <X />
            </Button>
          </div>
          <div>
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 mb-2 rounded cursor-pointer ${
                  activeChat === chat.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveChat(chat.id)}
              >
                {chat.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
