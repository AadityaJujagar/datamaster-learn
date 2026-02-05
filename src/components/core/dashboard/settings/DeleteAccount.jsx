import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../../services/operations/settingsAPI";
import { ConfirmationModal } from "../../../common/ConfirmationModal";
import { useState } from "react";

export const DeleteAccount = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confimationModal, setConfimationModal] = useState(false);

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate));
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" />
        </div>
        <div className="flex flex-col space-y-6">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer p-2 border border-pink-300 rounded-lg italic text-pink-300"
            onClick={() =>
              setConfimationModal({
                text1: "WARNING: Deleting Account",
                text2: "Are you sure you want to delete your account?",
                btn1Text: "Delete Account",
                btn2Text: "Cancel",
                btn1Handler: () => {
                  handleDeleteAccount();
                },
                btn2Handler: () => {
                  setConfimationModal(false);
                },
              })
            }
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {confimationModal ? (
        <ConfirmationModal modalData={confimationModal} />
      ) : null}
    </>
  );
};
