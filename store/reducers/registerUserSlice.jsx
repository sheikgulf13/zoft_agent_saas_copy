import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    username: '',
    email: '',
    password: '',
    animationComplete: false,
    showLogin: false,
    showRegister: false,
    fadeIn: false


}

const userslice = createSlice({
    name: 'registerUser',
    initialState,
    reducers: {

        setUsername: (state, action)=>{
            state.username = action.payload
        },
        setEmail: (state, action)=>{
            state.email = action.payload
        },
        setPassword: (state, action)=>{
            state.password = action.payload
        },
        setAnimationComplete: (state, action)=>{
            state.animationComplete = action.payload
        },
        setShowLogin: (state, action)=>{
            state.showLogin = action.payload
        },
        setShowRegister: (state, action)=>{
            state.showRegister = action.payload
        },
        setFadeIn: (state, action)=>{
            state.fadeIn = action.payload
        }
    }
})

export const { setUsername, setEmail, setPassword, setAnimationComplete, setShowLogin, setShowRegister, setFadeIn } = userslice.actions
export default userslice.reducer