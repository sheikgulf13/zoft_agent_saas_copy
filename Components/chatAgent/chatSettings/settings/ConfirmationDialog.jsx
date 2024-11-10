import React, { useState } from "react";
import { OutlinedButton } from "../../../../Components/buttons/OutlinedButton";
import { ContainedButton } from "@/Components/buttons/ContainedButton";

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, cancelClass }) => {
  const [text, setText] = useState("");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center text-black bg-black bg-opacity-60">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p className="mb-4">
          We will immediately delete your bot details along with files used
          to create it.
          <br />
          You will no longer be able to use the endpoints for this bot.
        </p>
        <span> To verify, type "delete my bot" below:</span>
        <br />
        <input
          className="border w-[100%] p-[1vh]"
          type="text"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="flex mt-[1vh] justify-end gap-4">
          <OutlinedButton onClick={onClose}>Cancel</OutlinedButton>
          {text === "delete my bot" && (
            <ContainedButton
              onClick={onConfirm}
              isLoading={text !== "delete my bot"}
              backgroundColor={'rgb(239 68 68 / var(--tw-bg-opacity))'}
            >
              Delete
            </ContainedButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
