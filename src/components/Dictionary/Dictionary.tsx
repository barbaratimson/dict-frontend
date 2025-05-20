import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { WordT } from "../Router/pages/UserPage/UserPage";
import { Word } from "../Word/Word";
import {
  useAddWordsToDictionaryMutation,
  useDeleteWordsFromDictionaryMutation,
  useGetDictionaryQuery,
  useGetExcludedWordsQuery,
  useRenameDictionaryMutation,
} from "../../store/api/apiSlice";
import Search from "../Search/Search";
import { Input } from "../Input/Input";
import { CheckIcon } from "@heroicons/react/20/solid";

export const Dictionary = () => {
  const [isAddingWords, setIsAddingWords] = useState(false);
  const { dictionaryId } = useParams();
  const { data: dictionary, refetch: refetchDictionary } =
    useGetDictionaryQuery({ dict_id: dictionaryId ?? "" });
  const [selectedWords, setSelectedWords] = useState<WordT[]>([]);
  const [deleteWordsfromDict, { isLoading: isDeleting }] =
    useDeleteWordsFromDictionaryMutation();
  const [addWordsToDict, { isLoading: idAddingWords }] =
    useAddWordsToDictionaryMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [renameDict] = useRenameDictionaryMutation();
  const [dictName, setDictName] = useState(dictionary?.name ?? "");

  const handleWordClick = (word: WordT) => {
    if (!selectedWords.find((elem) => elem.id === word.id)) {
      setSelectedWords([...selectedWords, word]);
    } else {
      setSelectedWords(selectedWords.filter((elem) => elem.id !== word.id));
    }
  };

  const handleAddWordsToDict = (words: WordT[]) => {
    if (dictionary) {
      addWordsToDict({ dictId: dictionary?.id, words: selectedWords }).then(
        () => {
          setIsAddingWords(false);
          setSelectedWords([]);
          refetchDictionary();
        },
      );
    }
  };

  const handleReanmeDict = (dictName: string) => {
    if (dictionary) {
      renameDict({ dictId: dictionary?.id, newName: dictName }).then(() => {
        setIsEditing(false);
        refetchDictionary();
      });
    }
  };

  const handleWordsDeletion = async (words: WordT[]) => {
    if (!words || !dictionary) return;
    await deleteWordsfromDict({ dictId: dictionary.id, words: selectedWords });
    refetchDictionary();
    setSelectedWords([]);
  };

  useEffect(() => {
    refetchDictionary();
  }, []);

  useEffect(() => {
    setDictName(dictionary?.name ?? "");
  }, [dictionary]);

  if (!dictionaryId) <div>No dictionary found</div>;
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row items-center rounded-t-lg bg-primary-700 p-2 pr-5">
        <div className="mr-2 text-white/70">Dictionary:</div>
        {!isEditing ? (
          <div
            onClick={() => {
              setIsEditing(true);
            }}
            className="text-h3 text-white"
          >
            {dictName}
          </div>
        ) : (
          <div className="flex flex-row items-center gap-4">
            <Input
              className="text-h3"
              value={dictName}
              onChange={(e) => {
                setDictName(e.target.value);
              }}
            ></Input>
            <CheckIcon
              onClick={() => {
                handleReanmeDict(dictName);
              }}
              className="size-8 cursor-pointer rounded-lg text-white hover:bg-white/20"
            ></CheckIcon>
          </div>
        )}
        <div
          className={`${isAddingWords && "!bg-primary-400"} ml-auto rounded-md bg-white/60 p-2 text-white`}
          onClick={() => {
            setIsAddingWords(!isAddingWords);
          }}
        >
          Add
        </div>
      </div>
      <div className="flex flex-row items-center rounded-b-lg bg-primary-800 p-2 pr-5">
        <div className="ml-2 text-white">{selectedWords.length}</div>
        {!isAddingWords && selectedWords.length !== 0 && (
          <div className="ml-auto flex flex-row gap-4">
            <div
              className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-400"
              onClick={() => {
                handleWordsDeletion(selectedWords);
              }}
            >
              Delete
            </div>
          </div>
        )}
      </div>
      <div>{selectedWords.length}</div>
      <div className="flex flex-row gap-4 p-2">
        {!isAddingWords ? (
          dictionary?.words && dictionary?.words.length !== 0 ? (
            dictionary?.words.map((word) => (
              <Word
                selected={selectedWords.includes(word)}
                onClick={() => {
                  handleWordClick(word);
                }}
                disableControls
                word={word}
              />
            ))
          ) : (
            <div className="w-full text-center text-h1 text-white">
              No words :(
            </div>
          )
        ) : (
          <AddWordsComponent
            onAdd={() => {
              handleAddWordsToDict(selectedWords);
            }}
            dictId={dictionaryId ?? ""}
            selectedWords={selectedWords}
            onSelect={handleWordClick}
          />
        )}
      </div>
    </div>
  );
};

interface AddWordsComponentProps {
  dictId: string;
  onSelect: (word: WordT) => void;
  selectedWords: WordT[];
  onAdd: () => void;
}

const AddWordsComponent = ({
  dictId,
  onSelect,
  onAdd,
  selectedWords,
}: AddWordsComponentProps) => {
  const [words, setWords] = useState<WordT[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<WordT[]>();
  const { data: wordsToAdd, refetch, isLoading } = useGetExcludedWordsQuery({
    dict_id: dictId,
    page: 0,
    items_per_page: 20,
  });


  useEffect(() => {
    refetch()
  }, []);

  useEffect(() => {
    if (search !== "") {
      const debounce = setTimeout(() => {
        setSearchResults(
          wordsToAdd?.filter((elem) =>
            elem.value.toLowerCase().split(" ").join().includes(search),
          ),
        );
      }, 300);
      return () => {
        clearInterval(debounce);
      };
    } else {
      setSearchResults(undefined);
    }
  }, [search]);

  if (!words) return <div>No words</div>;
  return (
    <div className="flex w-full flex-col justify-center gap-4">
      <div className="flex flex-row items-center justify-between">
        <Search
          value={search}
          setValue={(value) => setSearch(value.toLowerCase().split(" ").join())}
        />
        {selectedWords?.length !== 0 && (
          <div
            className="cursor-pointer rounded-xl bg-primary-400 px-8 py-2 text-white hover:bg-white/60"
            onClick={onAdd}
          >
            Add
          </div>
        )}
      </div>
      <div className="flex flex-row flex-wrap gap-4 p-4">
        {!searchResults ? (
          wordsToAdd?.map((word) => (
            <Word
              key={word.id}
              word={word}
              selected={selectedWords.includes(word)}
              onClick={() => {
                onSelect(word);
              }}
            />
          ))
        ) : searchResults?.length !== 0 ? (
          searchResults?.map((word) => (
            <Word
              key={word.id}
              word={word}
              selected={selectedWords.includes(word)}
              onClick={() => {
                onSelect(word);
              }}
            />
          ))
        ) : (
          <div>No words found :(</div>
        )}
      </div>
    </div>
  );
};
