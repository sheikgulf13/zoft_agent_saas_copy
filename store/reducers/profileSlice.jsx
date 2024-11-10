import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    displayName: 'k.Jane',
    email: 'k.smartframe.com',
    phoneNumber: '90255 XXXXX',
    profilePicture: 'https://images.unsplash.com/photo-1570158268183-d296b2892211?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHBvcnRyYWl0fGVufDB8fDB8fHww'
};

const profileslice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfile: (state, action) => {
            return { ...state, ...action.payload }
           
        },
    }
})

export const { updateProfile } = profileslice.actions
export default profileslice.reducer