import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    url: [],
    rawText: '',
    fileCount: {},
  };

const datasourceSlice = createSlice({
    name: 'dataSource',
    initialState,
    reducers:{
        seturl: (state, action)=>{
            state.url = action.payload
        },
        setrawText: (state, action)=>{
            state.rawText = action.payload
        },
        setFileCount: (state,action)=>{
            state.fileCount=action.payload
        },
        resetData: () => initialState, 
    }
})

export const {seturl, setrawText,setFileCount, resetData} = datasourceSlice.actions
export default datasourceSlice.reducer