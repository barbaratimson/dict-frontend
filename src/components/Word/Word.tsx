import {WordT} from "../Router/pages/UserPage/UserPage";
import * as React from "react";
import {HTMLAttributes} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setUserDictWords} from "../../store/reducers/userSlice";
import {useAddWordsToDictionaryMutation, useDeleteWordsFromDictionaryMutation} from "../../store/api/apiSlice";

interface WordProps {
    word: WordT,
    style?: HTMLAttributes<HTMLDivElement>
    className?: string
    disableControls?: boolean,
    onClick?: () => void,
    selected?: boolean,
}

export const Word = ({word, style, className, selected, onClick, disableControls = false}: WordProps) => {
    const [addWordsToDict, {isLoading: isAdding}] = useAddWordsToDictionaryMutation()
    const [deleteWordsfromDict, {isLoading: isDeleting}] = useDeleteWordsFromDictionaryMutation()
    const dispatch = useAppDispatch()
    const userDictWords = useAppSelector(state => state.user.dictWords)
    const setUserWords = (words: WordT[]) => dispatch(setUserDictWords(words))
    const handleAddButton = () => {
        if (!userDictWords.find(elem => elem.id === word.id)) {
           addWordsToDict({dictId:"680383f43655364000d439c5", words:[word]})
        } else {
          deleteWordsfromDict({dictId:"680383f43655364000d439c5", words:[word]})
        }
    }


    if (!word.value || !word.translate) return <div className={`flex flex-col w-fit p-2 rounded-xl overflow-hidden`}><div>{word.id} Error</div></div>
    return (
        <div className={`${className} flex flex-col w-fit p-2 rounded-xl overflow-hidden cursor-pointer hover:bg-primary-600 ${selected ? "!bg-primary-300" : "bg-primary-800"}`} onClick={onClick} style={style}>
            <div className="flex flex-row gap-2">
                <div className="flex text-white flex-col">
                    <div>{word.value}</div>
                    <div>{word.translate}</div>
                </div>
            </div>
        </div>
    );
};