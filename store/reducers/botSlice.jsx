import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  botName: '',
  description: '',
  prompt: '',
  loading: true,
};

const botSlice = createSlice({
  name: 'bot',
  initialState,
  reducers: {
    setBotName: (state, action) => {
      state.botName = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setPrompt: (state, action) => {
      state.prompt = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    resetChatBot: (state, action) => ({
      botName: '',
      description: '',
      prompt: '',
      loading: true,
      workSpaceId: '',
      workspacename: '',
      twiliosid: '',
      twilioauthtoken: '',
      elevenlabskey: '',
      openaikey: '',
    })
  },
});



export const { setBotName, setDescription, setPrompt, setLoading, resetChatBot } = botSlice.actions;
export default botSlice.reducer;
