import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleSelectMember,
  selectAllMembers,
  deselectAllMembers,
  addMember,
  removeMember
} from '../../store/reducers/teamSlice';
import GradientButton from '../buttons/GradientButton';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaPlus } from 'react-icons/fa';
import DeleteIcon from '../Icons/DeleteIcon';
import SearchIcon from '../Icons/SearchIcon';
import DotIcon from '../Icons/DotIcon';
import CheckBox from '../buttons/CheckBox';
import useTheme from "next-theme";

const Team = () => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.team.members);
  const selectedMembers = useSelector((state) => state.team.selectedMembers);
  const { theme } = useTheme();

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleSelectAll = () => {
    if (selectedMembers.length === members.length) {
      dispatch(deselectAllMembers());
    } else {
      dispatch(selectAllMembers());
    }
  };

  const handleSelectMember = (id) => {
    dispatch(toggleSelectMember(id));
  };

  const handleDeleteMember = (id) => {
    dispatch(removeMember(id));
  };

  const handleAddMember = () => {
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Member",
      email: "newmember@example.com",
      lastActivity: "Today",
      role: "Member",
      avatar: "https://via.placeholder.com/150",
    };
    dispatch(addMember(newMember));
  };

  const isSelected = (id) => selectedMembers.includes(id);

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredMembers.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);

  const changePage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className={`text-[1vw] px-[0.833vw] py-[3.2vh] h-[80vh] flex flex-col gap-[1.7vw] ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-[#F2F4F7] text-black'}`}>
      <div className="">
        <h1 className="text-[2.5vw] font-bold ml-[3vw] ">Team</h1>
      </div>
      <div className={`flex flex-col w-[76vw] translate-x-[5%] mb-[1.6vh] h-[35vh] justify-between gap-[2vw] py-[3.2vh] rounded-[0.417vw] shadow-xl ${theme === "dark" ? 'bg-[#1F222A] text-white' : 'bg-white text-black'}`}>
        <h1 className='capitalize text-[1.5vw] font-semibold px-[3.3vw] w-1/2 flex items-center gap-[.7vw]'>
          Team Owner 
          <span>
            <FaPlus className='text-[1.25vw] cursor-pointer' onClick={handleAddMember} />
          </span>
        </h1>
        <div className="flex-1 flex justify-start items-end gap-[0.417vw] px-[3.3vw]">
          <div className={`flex items-center justify-between gap-[1vw] px-[2vw] rounded-[0.417vw] py-[.5vw] ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-zinc-200 text-black'}`}>
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D" alt="Jane Cooper" className="rounded-full w-[2.5vw] h-[2.5vw] object-cover object-top" />
            <div className='flex items-center justify-between gap-[4vw]'>
              <div className='flex flex-col'>
                <div className="text-[1.025vw] capitalize">Jane Cooper</div>
                <div className="text-[0.625vw]">janecooper@gmail.com</div>
              </div>
              <DotIcon />
            </div>
          </div>
          <div className={`flex items-center justify-between gap-[1vw] px-[2vw] rounded-[0.417vw] py-[.5vw] ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'bg-zinc-200 text-black'}`}>
            <img src="https://images.unsplash.com/photo-1521119989659-a83eee488004?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBvcnRyYWl0fGVufDB8fDB8fHww" alt="Wade Warren" className="rounded-full w-[2.5vw] h-[2.5vw] object-cover object-center" />
            <div className='flex items-center justify-between gap-[4vw]'>
              <div className='flex flex-col'>
                <div className="text-[1vw] capitalize">wade warren</div>
                <div className="text-[0.625vw]">wadewarren@gmail.com</div>
              </div>
              <DotIcon />
            </div>
          </div>
        </div>
      </div>
      <div className="mb-[1.6vh] flex justify-between items-center px-[4vw] relative">
        <input
          type="text"
          placeholder="Search by Members"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-[1vw] w-1/2 px-[2.9vw] py-[1.6vh] rounded-[0.625vw] border-[0.052vw] shadow-xl flex justify-between"
        />
        <SearchIcon left={'4.6vw'} />
        <GradientButton
          text="Add Members"
          Icon={FaPlus}
          onClick={handleAddMember}
          className="w-fit bg-gradient-to-r from-[#EB1CD6] to-[#F4A36F] text-white py-[0.8vh] px-[0.833vw] rounded-[0.625vw]"
        />
      </div>
      <div className={` w-11/12 mx-auto p-[1vw] rounded-xl ${theme === "dark" ? 'bg-[#1A1C22] text-white' : ' text-black bg-white'}`}>
        <table className={`h-fit w-full  py-[1vh] rounded-xl mx-auto border-[0.052vw rounded-[0.625vw overflow-scroll ${theme === "dark" ? 'bg-[#1F222A] text-white' : ' text-black bg-white'}`}>
          <thead className='bg-transparent'>
            <tr className={` shadow-[#000000] ${theme === "dark" ? 'bg-[#1A1C22] text-white' : ' text-black bg-[#F2F4F7]'}`}>
              <th className={`p-[0.457vw]  text-start relative ${theme === "dark" ? 'bg-[#1A1C22] text-white' : 'text-black'}`}>
                <div className={`checkbox-container flex items-center justify-center`}>
                <CheckBox
                  checked={selectedMembers.length === members.length}
                  onChange={handleSelectAll}
                />
                </div>
              </th>
              <th className="p-[0.457vw] text-center">Members</th>
              <th className="p-[0.457vw] text-center">Email</th>
              <th className="p-[0.457vw] text-center">Last Activity</th>
              <th className="p-[0.457vw] text-center">Role</th>
              <th className="p-[0.457vw] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className='h-[4vh] overflow-scroll rounded-l-xl'>
            {currentRows.map((member) => (
              <tr key={member.id} className={` h-[6vh] border-zinc-200 border-y-[.1vw] ${theme !== "dark" ? ' hover:bg-[#ddd] rounded-l-xl border-bg-zinc-400' : 'bg-[#1A1C22] border-white hover:bg-[#33373E]'}`}>
                <td className="pt-[0.408vw] text-center">
                  <CheckBox
                    checked={isSelected(member.id)}
                    onChange={() => handleSelectMember(member.id)}
                  />
                </td>
                <td className="p-[0.208vw]  flex items-center justify-center h-full" style={{ lineHeight: '1.6vh' }}> {/* Adjust the padding and line height here */}
                  <img src={member.avatar} alt={member.name} className="rounded-full w-[1.2vw] h-[3.1vh] mr-[.3vw]" />
                  {member.name}
                </td>
                <td className="p-[0.208vw] text-center" style={{ lineHeight: '1vh' }}> {/* Adjust the padding and line height here */}
                  {member.email}
                </td>
                <td className="p-[0.208vw] text-center" style={{ lineHeight: '1vh' }}> {/* Adjust the padding and line height here */}
                  {member.lastActivity}
                </td>
                <td className="p-[0.208vw] text-center" style={{ lineHeight: '1vh' }}> {/* Adjust the padding and line height here */}
                  {member.role}
                </td>
                <td className="p-[0.208vw] text-center" style={{ lineHeight: '1vh' }}> {/* Adjust the padding and line height here */}
                  <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteMember(member.id)}>
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-[.6vh]">
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-[0.833vw] py-[0.117vw] ${theme === "dark" ? 'bg-[#33373E] text-white' : 'bg-gray-300 text-black'} rounded-l-[0.417vw] disabled:opacity-50`}
        >
          <FaAngleDoubleLeft></FaAngleDoubleLeft>
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => changePage(index + 1)}
            className={`px-[0.833vw] py-[0.117vw] ${currentPage === index + 1 ? 'bg-blue-500 text-white' : `${theme === "dark" ? 'bg-[#23252C] text-white' : 'bg-gray-200 text-black'}`} hover:bg-blue-500 hover:text-white`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-[0.833vw] py-[0.117vh] ${theme === "dark" ? 'bg-[#33373E] text-white' : 'bg-gray-300 text-black'} rounded-r-[0.417vw] disabled:opacity-50`}
        >
          <FaAngleDoubleRight></FaAngleDoubleRight>
        </button>
      </div>
    </div>
  );
};

export default Team;