import { createSlice } from "@reduxjs/toolkit"



const initialState = {
    workSpaceId: '',
    workspacename: '',
    twiliosid: '',
    twilioauthtoken: '',
    elevenlabskey: '',
    openaikey: '',
}

const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWorkSpaceId: (state, action) =>{
            state.workSpaceId = action.payload
        },
        setworkspacename: (state, action) =>{
            state.workspacename = action.payload
        },
        settwilioauthtoken: (state, action) =>{
            state.twilioauthtoken = action.payload
        },
        settwiliosid: (state, action) =>{
            state.twiliosid = action.payload
        },
        setelevenlabskey: (state, action) =>{
            state.elevenlabskey = action.payload
        },
        setopenaikey: (state, action) =>{
            state.openaikey = action.payload
        },
        resetWorkSpace: (state, action) => ({
            workSpaceId: '',
            workspacename: '',
            twiliosid: '',
            twilioauthtoken: '',
            elevenlabskey: '',
            openaikey: '',
        })
    }
})

export const {
    setWorkSpaceId,
    setworkspacename,
    settwilioauthtoken,
    settwiliosid,
    setelevenlabskey,
    setopenaikey,
    resetWorkSpace
} = workspaceSlice.actions
export default workspaceSlice.reducer