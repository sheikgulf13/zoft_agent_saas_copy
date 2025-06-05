"use client"

import React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useRouter } from 'next/navigation';
import { ContainedButton } from '../buttons/ContainedButton';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  pt: 5,
  px: 8,
  pb: 6
};

export default function NestedModal() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/workspace")
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "600px" }} className="flex flex-col justify-between items-center gap-4 rounded-lg">
          <h2 id="parent-modal-title" className="font-bold text-black">Work in progress (sneak peak)</h2>
          <p id="parent-modal-description" className='text-gray-600'>
           This page is under progress
          </p>
          <ContainedButton onClick={handleClose} className="p-4">Go back</ContainedButton>
        </Box>
      </Modal>
    </div>
  );
}

const InprogressModal = () => {
  return (
    <NestedModal />
  )
}

export {InprogressModal}