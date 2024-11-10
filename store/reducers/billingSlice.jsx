import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    nameOnCard: 'Revathi',
    expiry: '3/28',
    cardNumber: '8269 9620 9292 2538',
    cvv: '316'
}

const billingslice = createSlice({
    name: 'billing',
    initialState,
    reducers: {
        setNameOnCard: (state, action)=>{
            state.nameOnCard = action.payload
        },
        setExpiry: (state, action)=>{
            state.expiry = action.payload
        },
        setCardNumber: (state, action)=>{
            state.cardNumber = action.payload
        },
        setCvv: (state, action)=>{
            state.cvv = action.payload
        },
    }
})

export const { setNameOnCard, setExpiry, setCardNumber, setCvv } = billingslice.actions
export default billingslice.reducer