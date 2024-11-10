import { createSlice } from '@reduxjs/toolkit';
import { Bounce, toast } from 'react-toastify';

const initialState = {
  members: [
    // Sample members data
    { id: 1, name: 'Jane Cooper', email: 'Kayzen@gmail.com', lastActivity: '1 minute ago', role: 'Owner', avatar: 'path/to/avatar.jpg' },
    { id: 2, name: 'Guy Hawkins', email: 'Kayzen@gmail.com', lastActivity: '17 hours ago', role: 'Member', avatar: 'path/to/avatar.jpg' },
    { id: 3, name: 'Theresa Webb', email: 'Kayzen@gmail.com', lastActivity: '5 hours ago', role: 'Member', avatar: 'path/to/avatar.jpg' },
    { id: 4, name: 'Esther Howard', email: 'Kayzen@gmail.com', lastActivity: '3 minutes ago', role: 'Member', avatar: 'path/to/avatar.jpg' },
  ],
  selectedMembers: [],
};

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    toggleSelectMember: (state, action) => {
      const memberId = action.payload;
      if (state.selectedMembers.includes(memberId)) {
        state.selectedMembers = state.selectedMembers.filter((id) => id !== memberId);
      } else {
        state.selectedMembers.push(memberId);
      }
    },
    selectAllMembers: (state) => {
      state.selectedMembers = state.members.map((member) => member.id);
    },
    deselectAllMembers: (state) => {
      state.selectedMembers = [];
    },
    addMember: (state, action) => {
      if(state.members.length < 8){
        state.members.push(action.payload); 
     
      }
      else{
        toast.warning('You Can Only Add Up To 8 Members!', {
          position: "top-center",
          autoClose: 800,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        })
      }
      },

    removeMember: (state, action) => {
      state.members = state.members.filter(member => member.id !== action.payload); // Remove the member from the state
      state.selectedMembers = state.selectedMembers.filter(id => id !== action.payload); // Remove the member from selected members if selected
    }
}})

export const { toggleSelectMember, selectAllMembers, deselectAllMembers, addMember, removeMember } = teamSlice.actions;
export default teamSlice.reducer;
