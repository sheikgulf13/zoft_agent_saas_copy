import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    Language: 'English',
    voice: 'alexa',
    stability: 50,
    similarity: 70,
    exaggeration: 0,
    speakerBoost: false,
    advancedSetting: true
}

const voiceslice = createSlice({
    name: 'voice',
    initialState,
    reducers: {
        setLanguage: (state, action)=>{
            state.language = action.payload
        },
        setVoice: (state, action)=>{
            state.voice = action.payload
        },
        setStability: (state, action)=>{
            state.stability = action.payload
        },
        setSimilarity: (state, action)=>{
            state.similarity = action.payload
        },
        setExaggeration: (state, action)=>{
            state.exaggeration = action.payload
        },
        setSpeakerBoost: (state, action)=>{
            state.speakerBoost = action.payload
        },
        setAdvancedSetting: (state, action)=>{
            state.advancedSetting = action.payload
        },
    }
})

export const { setLanguage, setVoice, setStability, setSimilarity, setExaggeration, setSpeakerBoost, setAdvancedSetting } = voiceslice.actions
export default voiceslice.reducer