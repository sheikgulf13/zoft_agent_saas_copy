import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    messages: [],
}

const emebedCodeslice = createSlice({
    name: 'embedCode',
    initialState,
    reducers: {
        addMessage: (state, action) => {
            state.messages.push(action.payload);
          },
    }
})

export const { addMessage } = emebedCodeslice.actions
export default emebedCodeslice.reducer