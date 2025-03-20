"use client";

import React, { useEffect, useState } from "react";
import ChatSettingNav from "./ChatSettingNav";
import useTheme from "next-theme";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from "@mui/material";
import { FiPhone, FiClock, FiDownload, FiShare2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import { getChatListApi } from "../../../api/chat-list";
import { getChatDatatApi } from "../../../api/chatData";
import { downloadArrayAsTxt } from "../../../utility/downloadArrayAsTxt ";
import { humanizeUnixTimestamp } from "@/utility/data-utility";

// Create a light theme with grey accents
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3f51b5",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

// Dummy data for call logs
const callLogs = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Call ${i + 1}`,
  status: i % 5 === 0 ? "no-answer" : "completed",
  timestamp: new Date().toISOString(),
}));

// Dummy conversation data
const dummyConversation = [
  { id: 1, sender: "Agent", message: "Hello! How can I assist you today?" },
  {
    id: 2,
    sender: "User",
    message: "Hi, I'm interested in your services. Can you tell me more?",
  },
  {
    id: 3,
    sender: "Agent",
    message:
      "Our services include AI-powered call management, voice transcription, and analytics. What specific area are you most interested in?",
  },
  {
    id: 4,
    sender: "User",
    message: "I'm mainly looking for call management. How does that work?",
  },
  {
    id: 5,
    sender: "Agent",
    message:
      "Great question! Our AI call management system can handle incoming calls, route them to the appropriate department, and even answer basic queries. It's designed to save time and improve customer satisfaction.",
  },
];

function ChatListAgent(props) {
  const { selectedChatAgent } = props;

  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedChatData, setSelectedChatData] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  const handleDownload = () => {
    downloadArrayAsTxt(
      selectedChat?.conversation,
      `${selectedChatAgent?.bot_name}_chat_${selectedChat?.conversation_id}.txt`
    );
  };

  const handleCallSelect = (chat) => {
    setSelectedChat(chat);
    console.log(chat);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const fetchChatList = async () => {
    if (!selectedChatAgent) {
      return;
    }

    const chatList = await getChatListApi(selectedChatAgent.id);

    if (chatList) {
      setChatList(chatList);

      console.log(chatList);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, [selectedChatAgent]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        className=" bg-gray-100 text-gray-800 p-4 w-[80%] m-auto"
        style={{ height: "calc(100vh - 128px)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <div className="text-gray-800 font-bold">
            {selectedChatAgent?.bot_name}
          </div>
          <div className="text-gray-800">
            No of conversation{" "}
            <span className="font-bold">{chatList?.length}</span>
          </div>
        </div>

        {/* Main content */}
        <Box
          className="flex overflow-hidden py-4"
          style={{ height: "calc(100vh - 218px)" }}
        >
          {/* Call logs */}
          <Box className="w-1/3 h-full bg-white rounded-lg shadow">
            <List
              className="overflow-y-auto bg-white"
              style={{ height: "calc(100vh - 290px)" }}
            >
              {chatList
                .slice((page - 1) * logsPerPage, page * logsPerPage)
                .map((chat, index) => {
                  const originalIndex = (page - 1) * logsPerPage + index;

                  return (
                    <ListItem
                      key={chat.chat_agent_id}
                      sx={{ width: "auto" }}
                      button
                      onClick={() => handleCallSelect(chat)}
                      className={`mb-2 mx-2 border rounded-lg cursor-pointer`}
                    >
                      <ListItemText
                        primary={`Chat #${originalIndex + 1}`}
                        secondary={
                          <Typography
                            variant="body2"
                            className="text-green-600 text-base"
                          >
                            {humanizeUnixTimestamp(chat.created_at)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  );
                })}
            </List>
            <Pagination
              count={Math.ceil(chatList.length / logsPerPage)}
              page={page}
              onChange={handlePageChange}
              className="m-y-4 flex justify-center"
            />
          </Box>

          {/* Conversation */}
          <Box className="w-2/3 pl-4 h-full overflow-y-auto">
            <Box className="bg-white rounded-lg shadow p-4 h-full">
              {selectedChat ? (
                <>
                  <Box className="flex justify-between items-center mb-4">
                    <Typography
                      variant="h6"
                      className="text-gray-800 font-normal"
                    >
                      ID : {selectedChat?.conversation_id}
                    </Typography>
                    <Box>
                      <OutlinedButton className="mr-4" onClick={handleDownload}>
                        <span className="flex items-center gap-2">
                          <FiDownload />
                          downloads
                        </span>
                      </OutlinedButton>
                    </Box>
                  </Box>
                  <Box
                    className="overflow-y-auto bg-gray-100 rounded p-4 flex flex-col"
                    style={{ height: "calc(100vh - 330px)" }}
                  >
                    {selectedChat &&
                      selectedChat?.conversation.map((chat, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg max-w-[75%] mb-2 ${
                            chat.type === "bot"
                              ? "bg-gray-200 self-start"
                              : "bg-blue-500 text-white self-end"
                          }`}
                        >
                          <p
                            dangerouslySetInnerHTML={{ __html: chat.message }}
                          ></p>
                        </div>
                      ))}
                  </Box>
                </>
              ) : (
                <p className="text-center">No chat selected</p>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const Activity = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { selectedChatAgent } = useSelector((state) => state.selectedData);

  return (
    <div className={`w-full h-[100vh]`}>
      <div
        className={`h-full px-8 border-b-[.1vw] w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <div
          className={`border-b-[.1vw] flex justify-center relative w-full mt-[2vw] pt-[.6vw] mb-[.9vw] text-base border-zinc-300 ${
            theme === "dark" ? "text-[#9f9f9f]" : " text-black"
          }`}
        >
          <div className="absolute left-[2vw] top-[-.6vw]">
            <OutlinedButton
              onClick={() =>
                router.push(
                  `/workspace/agents?workspaceId=${selectedChatAgent?.workspace_id}`
                )
              }
            >
              <FaArrowLeftLong />
              <span className="ml-2">Back to workspace</span>
            </OutlinedButton>
          </div>
          <ChatSettingNav />
        </div>
        <ChatListAgent selectedChatAgent={selectedChatAgent} />
      </div>
    </div>
  );
};

export default Activity;
