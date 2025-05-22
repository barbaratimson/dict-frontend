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
import Search from "../../../Search/Search";
import { Word } from "../../../Word/Word";
import * as React from "react";
import { WordT } from "../UserPage/UserPage";
import { apiGetWords, apiSearchAllWords } from "../../../../utils/apiRequests";

export const Home = () => {
  const [words, setWords] = useState<WordT[]>([])
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState<WordT[]>()

  useEffect(() => {
    apiGetWords().then(data => setWords(data ?? []))
  }, []);

  useEffect(() => {
    if (search !== "") {
      const debounce = setTimeout(() => {
        apiSearchAllWords(search).then(data => setSearchResults(data ?? []))
      }, 300)
      return () => {
        clearInterval(debounce)
      }
    } else {
      setSearchResults(undefined)
    }
  }, [search]);

  if (!words) return <div>No words</div>

  return (
    <div className="relative flex flex-col h-[80vh] justify-center">
      <div className="text-h1 text-center text-white mb-10">Dictionary </div>
      <div className="flex flex-col px-10">
      <div className="flex flex-col">
        <p className="text-small text-white ml-10 border-b border-white w-[125px]">Seach for words</p>
        <Search value={search} setValue={(value)=>setSearch(value.toLowerCase().split(" ").join())}/>
      </div>
      <div className="flex flex-row gap-4 p-4">
        {!searchResults ? words?.map(word => (
          <Word key={word.id} word={word}/>
        )) : searchResults?.length !== 0 ? searchResults?.map(word => (
          <Word key={word.id} word={word}/>
        )) : (
          <div>No words found :(</div>
        )}
      </div>
      </div>
    </div>
  );
};

