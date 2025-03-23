"use client";

import React, { useEffect, useState } from "react";
import PhoneSettingNav from "./PhoneSettingNav";
import { useRouter } from "next/navigation";
import useTheme from "next-theme";
import { OutlinedButton } from "@/Components/buttons/OutlinedButton";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Pagination,
} from "@mui/material";
import { FiPhone, FiClock, FiDownload, FiShare2 } from "react-icons/fi";
import { getCallListApi } from "../../../api/call-list";
import { useDispatch, useSelector } from "react-redux";
import { setConversations } from "@/store/actions/callListActions";
import {
  humanizeSeconds,
  humanizeUnixTimestamp,
} from "../../../utility/data-utility";

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

function PhoneCallAgent(props) {
  const { callList, phoneAgent } = props;

  const [selectedCall, setSelectedCall] = useState("");
  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  const handleCallSelect = (call, index) => {
    setSelectedCall({ call, index });
  };
  const callingdata = JSON.parse(selectedCall?.call?.conversation || "{}");
  console.log(callList);

  console.log(callingdata);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const conversations = selectedCall?.call?.conversation
    ? selectedCall?.call?.conversation
    : [];

  const getAverageCallDuration = () => {
    let totalSecs = 0;
    callList.forEach((call) => {
      totalSecs += parseInt(call.call_duration_sec);
    });

    return parseInt(totalSecs / callList.length);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        className=" bg-gray-100 text-gray-800 p-4 w-[80%]"
        style={{ height: "calc(100vh - 140px)" }}
      >
        {/* Header */}
        <Box className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
          <Box className="flex items-center">
            <Avatar src="/placeholder.svg" alt="Nick" className="mr-4" />
            <Box>
              <Typography variant="h6" className="text-gray-800">
                {`${phoneAgent?.phone_agent_name} (${phoneAgent?.phone_agent_type})`}
              </Typography>
            </Box>
          </Box>
          <Box className="flex items-center space-x-6">
            <Box className="flex items-center">
              <FiPhone className="mr-2 text-gray-600" />
              <Typography className="text-gray-600">
                Calls: {callList.length}
              </Typography>
            </Box>
            <Box className="flex items-center">
              <FiClock className="mr-2 text-gray-600" />
              <Typography className="text-gray-600">
                Avg call time: {humanizeSeconds(getAverageCallDuration())}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Main content */}
        <Box
          className="flex overflow-hidden py-4"
          style={{ height: "calc(100vh - 230px)" }}
        >
          {/* Call logs */}
          <Box className="w-1/3 h-full bg-white rounded-lg shadow">
            <List
              className="overflow-y-auto bg-white"
              style={{ height: "calc(100vh - 302px)" }}
            >
              {callList
                .slice((page - 1) * logsPerPage, page * logsPerPage)
                .map((log, index) => {
                  const originalIndex = (page - 1) * logsPerPage + index;
                  return (
                    <ListItem
                      key={log.id}
                      sx={{ width: "auto" }}
                      button
                      onClick={() => handleCallSelect(log, index)}
                      className={`mb-2 mx-2 border rounded-lg cursor-pointer`}
                    >
                      <ListItemText
                        primary={`Call #${originalIndex + 1}`}
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              className="text-green-600 text-base"
                            >
                              {humanizeUnixTimestamp(log.created_at)}
                            </Typography>
                            <Typography>
                              {`Call duration: ${log?.duration_in_mins}m ${log?.duration_in_sec}s`}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
            </List>
            <Pagination
              count={Math.ceil(callLogs.length / logsPerPage)}
              page={page}
              onChange={handlePageChange}
              className="m-y-4 flex justify-center"
            />
          </Box>

          {/* Conversation */}
          <Box className="w-2/3 pl-4 h-full overflow-y-auto">
            <Box className="bg-white rounded-lg shadow p-4 h-full w-full">
              {selectedCall ? (
                <>
                  <Box className="flex justify-between items-center mb-4">
                    <Typography variant="h6" className="text-gray-800">
                      {`Call ${selectedCall.index + 1}`}
                    </Typography>
                    <Box>
                      <OutlinedButton className="mr-4">
                        <FiDownload />
                        downloads
                      </OutlinedButton>
                      <OutlinedButton>
                        <FiShare2 />
                        share
                      </OutlinedButton>
                    </Box>
                  </Box>
                  <Box
                    className="overflow-y-auto bg-gray-100 rounded p-4 flex flex-col mb-2"
                    style={{ height: "calc(100vh - 342px)" }}
                  >
                    {callingdata &&
                      callingdata.map((chat, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg max-w-[75%] flex ${
                            chat.role === "user"
                              ? "bg-gray-200 self-start justify-start"
                              : "bg-blue-500 text-white self-end justify-end"
                          }`}
                        >
                          <p
                            dangerouslySetInnerHTML={{ __html: chat.content }}
                          ></p>
                        </div>
                      ))}
                  </Box>
                </>
              ) : (
                <p className="text-center">No call selected</p>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

const callHistory = () => {
  const { theme } = useTheme();
  const { selectedPhoneAgent } = useSelector((state) => state.selectedData);
  const router = useRouter();
  const [callList, setCallList] = useState([]);
  const { conversations, phoneAgentId } = useSelector(
    (state) => state.callList
  );
  const dispatch = useDispatch();

  // console.log(conversations, phoneAgentId);

  const getCallList = async (phoneAgentId) => {
    const result = await getCallListApi(phoneAgentId);
    if (result.length) {
      console.log("call List" + result);
      dispatch(setConversations({ phoneAgentId, conversations: result }));
      return setCallList(result);
    }
    return console.log("Error fetching call list");
  };

  useEffect(() => {
    if (selectedPhoneAgent?.id && selectedPhoneAgent?.id !== phoneAgentId) {
      getCallList(selectedPhoneAgent.id);
    }
  }, [selectedPhoneAgent]);

  useEffect(() => {
    if (selectedPhoneAgent?.id) {
      getCallList(selectedPhoneAgent.id);
    }
    console.log("calling");
  }, []);

  return (
    <div
      className={`flex flex-col justify-start items-center p-8  w-full h-[100vh]`}
    >
      <div
        className={`border-b-[1px] w-full text-base border-zinc-300 ${
          theme === "dark" ? "text-[#9f9f9f]" : " text-black"
        }`}
      >
        <PhoneSettingNav />
      </div>
      {selectedPhoneAgent && (
        <PhoneCallAgent callList={callList} phoneAgent={selectedPhoneAgent} />
      )}
    </div>
  );
};

export default callHistory;
