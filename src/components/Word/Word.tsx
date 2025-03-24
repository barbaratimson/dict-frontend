import {WordT} from "../Router/pages/UserPage/UserPage";
import styled from "styled-components";
import {theme} from "../../styles/theme";
import {Button, FlexColumn, FlexRow, TextSmall} from "../../styles/components";
import * as React from "react";
import {HTMLAttributes, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setUserDictWords} from "../../store/reducers/userSlice";
import {apiAddWords, apiRemoveWords} from "../../utils/apiRequests";

const WordWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: fit-content;
  padding: 10px;
  border-radius: 12px;
  overflow: hidden;
  background: ${theme.colors.secondary};
`

interface WordProps {
    word: WordT,
    style?: HTMLAttributes<HTMLDivElement>
    className?: string
    disableControls?: boolean,
}

export const Word = ({word, style, className, disableControls = false}: WordProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useAppDispatch()
    const userDictWords = useAppSelector(state => state.user.dictWords)
    const setUserWords = (words: WordT[]) => dispatch(setUserDictWords(words))
    const handleAddButton = () => {
        if (!userDictWords.find(elem => elem.id === word.id)) {
            setIsLoading(true)
            apiAddWords([word]).then((data) => {
                setIsLoading(false)
                if (data !== "OK") return
                console.log(`Word ${word.value} added!`)
                setUserWords([...userDictWords, word])
            })
        } else {
            setIsLoading(true)
            apiRemoveWords([word]).then((data) => {
                setIsLoading(false)
                if (data !== "OK") return
                console.log(`Word ${word.value} removed!`)
                setUserWords(userDictWords.filter(elem => elem.id !== word.id))
            })
        }
    }


    if (!word.value || !word.translate) return <WordWrapper><TextSmall>{word.id} Error</TextSmall></WordWrapper>
    return (
        <WordWrapper className={className} style={style}>
            <FlexRow gap={10}>
                <FlexColumn>
                    <TextSmall>{word.value}</TextSmall>
                    <TextSmall color={theme.colors.fontSecondary}>{word.translate}</TextSmall>
                </FlexColumn>
                {!disableControls ? (
                    !isLoading ? (

                    <Button
                        onClick={handleAddButton}>{userDictWords.find(elem => elem.id === word.id) ? "-" : "+"}</Button>
                ) : (
                    <div>L</div>
                )
                    ) : null}
            </FlexRow>
        </WordWrapper>
    );
};