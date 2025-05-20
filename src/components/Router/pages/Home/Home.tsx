import {
  useCreateVoteMutation,
  useGetCurrentUserQuery,
  useGetVotesQuery,
  useUpdateVoteMutation,
} from "../../../../store/api/apiSlice";
import { useEffect, useState } from "react";
import { Modal, ModalProps } from "../../../Modal/Modal";
import { Input } from "../../../Input/Input";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";

export const Home = () => {
  const { data: getVotesResult, isLoading: isVotesLodaing } =
    useGetVotesQuery();
  const [suggestWordModalActive, setSuggestWordModalActive] = useState(false);
  const [voteForWord] = useUpdateVoteMutation();
  const { data: user } = useGetCurrentUserQuery();

  function getTimeRemaining(endtime: string) {
    const total = Date.parse(endtime) - Date.parse(new Date().toISOString());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return `${days}d ${hours}h ${minutes}m`;
  }

  useEffect(() => {
    console.log(getVotesResult);
  }, [getVotesResult]);
  return (
    <div className="relative flex flex-col">
      <div className="text-h2 text-white mb-4">Words on suggestion:</div>
      <div className="flex flex-row gap-2 flex-wrap">
        {getVotesResult?.map((word) => (
          <div className="flex flex-col items-center justify-center border border-white rounded-xl p-4">
            <p className="text-white">{word.word}</p>
            <p className="text-white">{word.translate}</p>
            <div className="flex flex-row gap-4">
              {user?.id && !word.voters.includes(user?.id) ? (
                <>
                  <div
                    onClick={() => {
                      voteForWord({ id: word.id, against: false });
                    }}
                    className="bg-primary-500 cursor-pointer p-1 text-white"
                  >{`Vote For ${word.votesFor ?? 0}`}</div>
                  <div
                    onClick={() => {
                      voteForWord({ id: word.id, against: true });
                    }}
                    className="bg-primary-500 cursor-pointer p-1 text-white"
                  >{`Vote Against ${word.votesAgainst ?? 0}`}</div>
                </>
              ) : (
                <>
                  <div className="cursor-pointer p-1 text-white">{`Votes For ${word.votesFor ?? 0}`}</div>
                  <div className="cursor-pointer p-1 text-white">{`Votes Against ${word.votesAgainst ?? 0}`}</div>
                </>
              )}
            </div>
            <p className="text-white">{getTimeRemaining(word.decisionTime)}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-row p-2">
        <div
          className="bg-primary-500 text-white p-2 rounded-xl"
          onClick={() => {
            setSuggestWordModalActive(!suggestWordModalActive);
          }}
        >
          Suggest word
        </div>
      </div>
      <SuggestWordModal
        isActive={suggestWordModalActive}
        setIsActive={setSuggestWordModalActive}
      ></SuggestWordModal>
    </div>
  );
};

interface SuggestWordInput {
  word: string;
  translate: string;
  link: string;
}

const SuggestWordModal = ({
  isActive,
  setIsActive,
}: Omit<ModalProps, "children">) => {
  const [suggestWord] = useCreateVoteMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SuggestWordInput>();

  const location = useLocation();
  const isRegisterForm = location.pathname === "/auth/register";
  const onSubmit: SubmitHandler<SuggestWordInput> = (data) => {
    suggestWord(data).then((data) => console.log(data));
    setIsActive(false);
  };

  return (
    <Modal isActive={isActive} setIsActive={setIsActive}>
      <form
        className="flex w-fit flex-col items-center justify-center gap-4 rounded-xl text-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>Suggest a word</div>
        <Input
          label="Username"
          {...register("word", { required: true, maxLength: 10 })}
          placeholder="Word"
        ></Input>
        <Input
          label="Password"
          {...register("translate", { required: true })}
          placeholder="Translate"
        ></Input>
        {/*<Input label="Password" {...register("link", )} type="password" placeholder="Link"></Input>*/}
        <button className="bg-primary-500" type="submit">
          Suggest
        </button>
      </form>
    </Modal>
  );
};
