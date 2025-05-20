import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateDictionaryMutation,
  useDeleteDictionaryMutation,
  useGetCurrentUserQuery,
  useGetUserDictionariesQuery,
} from "../../store/api/apiSlice";
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";
import { apiUser } from "../../utils/apiRequests";
import { Modal } from "../Modal/Modal";

export const Sidebar = () => {
  const navigate = useNavigate();
  const [isOptionsOpened, setIsOptionsOpened] = useState(false);
  const [createDictionary] = useCreateDictionaryMutation();
  const { data: userDicts, refetch } = useGetUserDictionariesQuery();
  const { data: user } = useGetCurrentUserQuery();
  const [deleteDictId, setDeleteDictId] = useState<string | undefined>(
    undefined,
  );
  const [deleteDictionary] = useDeleteDictionaryMutation();
  const handleCreateDictionary = async () => {
    if (user) {
      createDictionary({ name: "New Dictionary", owner: user?.id }).then(() => {
        refetch();
      });
    }
  };
  return (
    <>
      <div className="bg-background-secondary relative h-[100vh] rounded-r-3xl p-5">
        <div className="flex h-full w-full flex-col">
          <h3
            className="text-h1 text-text-primary mb-5 border-b border-gray-100 pb-1"
            onClick={() => {
              navigate("/");
            }}
          >
            Dictionary
          </h3>
          <div className="flex cursor-pointer flex-col overflow-hidden rounded-lg bg-white/20 px-2 py-0.5">
            <div
              className="flex flex-row items-center gap-2 text-white"
              onClick={() => {
                setIsOptionsOpened(!isOptionsOpened);
              }}
            >
              <p className="text-h5 text-text-primary whitespace-nowrap">
                Your Dictionaries
              </p>
              <ChevronDownIcon className="size-4"></ChevronDownIcon>
            </div>
            {isOptionsOpened && (
              <div
                className={`overflow-hidden ${isOptionsOpened ? "h-fit" : "h-0"}`}
              >
                <div className="flex flex-col gap-2 py-2">
                  {userDicts &&
                    userDicts.map((dict) => (
                      <div className="flex flex-row gap-2 rounded-xl p-2 py-0.5 hover:bg-white/20">
                        <p
                          className="text-text-primary w-full"
                          onClick={() => {
                            navigate(`/dictionary/${dict.id}`);
                          }}
                        >
                          {dict.name}
                        </p>
                        <div
                          onClick={() => {
                            setDeleteDictId(dict.id);
                          }}
                          className="flex cursor-pointer items-center text-white/20 hover:text-white"
                        >
                          <TrashIcon className="ml-auto size-4"></TrashIcon>
                        </div>
                      </div>
                    ))}
                  <div className="bg-primary-500 hover:bg-primary-400 justify-center gap-1 flex cursor-pointer flex-row items-center rounded-lg px-2 text-white">
                    <p
                      onClick={() => {
                        handleCreateDictionary();
                      }}
                    >
                      Create Dictionary
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-auto flex w-full flex-row items-center justify-between rounded-xl bg-white/20 px-3 py-2">
            <p className="text-text-primary text-h5 items-center">
              {user?.username}
            </p>
            <div
              onClick={() => {
                localStorage.removeItem("Dict_Authorization");
                window.location.reload();
              }}
              className="cursor-pointer text-white/20 hover:text-white"
            >
              <ArrowRightStartOnRectangleIcon className="size-5"></ArrowRightStartOnRectangleIcon>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteDictionaryModal
        active={deleteDictId !== undefined}
        setActive={() => {
          setDeleteDictId(undefined);
        }}
        onSubmit={() => {
          if (deleteDictId) {
            deleteDictionary({ dictId: deleteDictId }).then(() => {
              refetch();
              setDeleteDictId(undefined);
            });
          }
        }}
      ></ConfirmDeleteDictionaryModal>
    </>
  );
};

interface ModalProps {
  active: boolean;
  setActive: (active: boolean) => void;
  onSubmit: () => void;
}

const ConfirmDeleteDictionaryModal = ({
  active,
  setActive,
  onSubmit,
}: ModalProps) => {
  useEffect(() => {
    console.log(active);
  }, [active]);
  return (
    <Modal isActive={active} setIsActive={setActive}>
      <div className="flex flex-col gap-4">
        <p className="text-h3 text-center text-white">Delete dictionary?</p>

        <button
          className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-2 py-0.5"
          onClick={() => {
            onSubmit();
          }}
        >
          Yeah
        </button>
      </div>
    </Modal>
  );
};
