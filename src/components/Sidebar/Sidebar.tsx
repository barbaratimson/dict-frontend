import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useChangePasswordMutation,
  useCreateDictionaryMutation,
  useDeleteDictionaryMutation,
  useGetCurrentUserQuery,
  useGetUserDictionariesQuery,
  useRenameAccountMutation
} from "../../store/api/apiSlice";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilIcon,
  KeyIcon,
} from "@heroicons/react/16/solid";
import { Modal } from "../Modal/Modal";

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isOptionsOpened, setIsOptionsOpened] = useState(false);
  const { data: userDicts, refetch } = useGetUserDictionariesQuery();
  const { data: user } = useGetCurrentUserQuery();

  // API mutations
  const [createDictionary] = useCreateDictionaryMutation();
  const [deleteDictionary] = useDeleteDictionaryMutation();
  const [renameAccount] = useRenameAccountMutation();
  const [changePassword] = useChangePasswordMutation();

  // Modal states
  const [deleteDictId, setDeleteDictId] = useState<string | undefined>(undefined);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Dictionary handlers
  const handleCreateDictionary = async () => {
    if (user) {
      try {
        await createDictionary({ name: "New Dictionary", owner: user.id }).unwrap();
        refetch();
      } catch (error) {
        console.error("Failed to create dictionary:", error);
      }
    }
  };

  const handleDeleteDictionary = async () => {
    if (deleteDictId) {
      try {
        await deleteDictionary({ dictId: deleteDictId }).unwrap();
        refetch();
        setDeleteDictId(undefined);
      } catch (error) {
        console.error("Failed to delete dictionary:", error);
      }
    }
  };

  // Account handlers
  const handleUsernameChange = async () => {
    if (newUsername.trim()) {
      try {
        await renameAccount({ new_name: newUsername }).unwrap();
        setIsUsernameModalOpen(false);
        setNewUsername("");
        // Optionally refresh user data
      } catch (error) {
        console.error("Failed to change username:", error);
      }
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword && newPassword.length !== 0) {
      try {
        await changePassword({
          password: newPassword,
        }).unwrap();
        setIsPasswordModalOpen(false);
        setCurrentPassword("");
        setNewPassword("");
      } catch (error) {
        console.error("Failed to change password:", error);
      }
    }
  };

  return (
    <>
      <div className="bg-background-secondary relative h-[100vh] rounded-r-3xl p-5">
        <div className="flex h-full w-full flex-col">
          <h3
            className="text-h1 text-text-primary mb-5 border-b border-divider pb-1 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Dictionary
          </h3>

          <div className="flex cursor-pointer flex-col overflow-hidden rounded-lg bg-background-tertiary px-2 py-0.5">
            <div
              className="flex flex-row items-center gap-2"
              onClick={() => setIsOptionsOpened(!isOptionsOpened)}
            >
              <p className="text-h5 text-text-primary whitespace-nowrap">
                Your Dictionaries
              </p>
              <ChevronDownIcon className="size-4 text-text-secondary" />
            </div>

            {isOptionsOpened && (
              <div className={`overflow-hidden ${isOptionsOpened ? "h-fit" : "h-0"}`}>
                <div className="flex flex-col gap-2 py-2">
                  {userDicts?.map((dict) => (
                    <div key={dict.id} className="flex flex-row gap-2 rounded-xl p-2 py-0.5 hover:bg-white/10">
                      <p
                        className="text-text-primary w-full cursor-pointer"
                        onClick={() => navigate(`/dictionary/${dict.id}`)}
                      >
                        {dict.name}
                      </p>
                      <div
                        onClick={() => setDeleteDictId(dict.id)}
                        className="flex cursor-pointer items-center text-text-muted hover:text-danger"
                      >
                        <TrashIcon className="ml-auto size-4" />
                      </div>
                    </div>
                  ))}
                  <div
                    className="bg-primary-500 hover:bg-primary-400 justify-center gap-1 flex cursor-pointer flex-row items-center rounded-lg px-2 py-1 text-text-primary"
                    onClick={handleCreateDictionary}
                  >
                    Create Dictionary
                  </div>
                </div>
              </div>
            )}
          </div>

          <p
            onClick={() => navigate("/vote")}
            className="text-text-primary text-h5 mt-2 rounded-lg bg-background-tertiary px-2 py-1 cursor-pointer hover:bg-white/10"
          >
            Vote for words
          </p>

          <p
            onClick={() => navigate("/quizlet")}
            className="text-text-primary text-h5 mt-2 rounded-lg bg-background-tertiary px-2 py-1 cursor-pointer hover:bg-white/10"
          >
            Play Quiz
          </p>

          <div className="mt-auto flex w-full flex-row items-center justify-between rounded-xl bg-background-tertiary px-3 py-2">
            <p className="text-text-primary text-h5">
              {user?.username}
            </p>
            <div className="flex gap-2">
              <div
                onClick={() => setIsUsernameModalOpen(true)}
                className="cursor-pointer text-text-muted hover:text-accent"
                title="Change username"
              >
                <PencilIcon className="size-5" />
              </div>
              <div
                onClick={() => setIsPasswordModalOpen(true)}
                className="cursor-pointer text-text-muted hover:text-accent"
                title="Change password"
              >
                <KeyIcon className="size-5" />
              </div>
              <div
                onClick={() => {
                  localStorage.removeItem("Dict_Authorization");
                  window.location.reload();
                }}
                className="cursor-pointer text-text-muted hover:text-danger"
                title="Logout"
              >
                <ArrowRightStartOnRectangleIcon className="size-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteDictionaryModal
        active={deleteDictId !== undefined}
        setActive={() => setDeleteDictId(undefined)}
        onSubmit={handleDeleteDictionary}
      />

      <Modal isActive={isUsernameModalOpen} setIsActive={setIsUsernameModalOpen}>
        <div className="flex flex-col gap-4 p-4 bg-background-secondary rounded-lg">
          <h3 className="text-h3 text-center text-text-primary">Change Username</h3>
          <div className="flex flex-col gap-2">
            <label className="text-text-secondary text-small">New Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              className="rounded-lg px-3 py-2 bg-background-tertiary text-text-primary border border-divider focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 bg-background-tertiary hover:bg-white/10 text-text-primary rounded-lg px-4 py-2 transition-colors"
              onClick={() => setIsUsernameModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-primary-500 hover:bg-primary-400 text-text-primary rounded-lg px-4 py-2 transition-colors"
              onClick={handleUsernameChange}
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Modal isActive={isPasswordModalOpen} setIsActive={setIsPasswordModalOpen}>
        <div className="flex flex-col gap-4 p-4 bg-background-secondary rounded-lg">
          <h3 className="text-h3 text-center text-text-primary">Change Password</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-text-secondary text-small">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="rounded-lg px-3 py-2 bg-background-tertiary text-text-primary border border-divider focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-text-secondary text-small">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="rounded-lg px-3 py-2 bg-background-tertiary text-text-primary border border-divider focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="flex-1 bg-background-tertiary hover:bg-white/10 text-text-primary rounded-lg px-4 py-2 transition-colors"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 bg-primary-500 hover:bg-primary-400 text-text-primary rounded-lg px-4 py-2 transition-colors"
              onClick={handlePasswordChange}
            >
              Change Password
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  onSubmit: () => void;
}

const ConfirmDeleteDictionaryModal = ({ active, setActive, onSubmit }: ModalProps) => {
  return (
    <Modal isActive={active} setIsActive={setActive}>
      <div className="flex flex-col gap-4 p-4 bg-background-secondary rounded-lg">
        <h3 className="text-h3 text-center text-text-primary">Delete dictionary?</h3>
        <p className="text-text-secondary text-body text-center">
          Are you sure you want to delete this dictionary? This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <button
            className="flex-1 bg-background-tertiary hover:bg-white/10 text-text-primary rounded-lg px-4 py-2 transition-colors"
            onClick={() => setActive(false)}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-danger hover:bg-red-500 text-text-primary rounded-lg px-4 py-2 transition-colors"
            onClick={onSubmit}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};