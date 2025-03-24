import * as React from "react";
import {useEffect, useState} from "react";
import {useAppSelector} from "../../../../../../store/store";
import {apiCreateDict, apiGetDicts} from "../../../../../../utils/apiRequests";
import {DictT} from "../../UserPage";
import styled from "styled-components";
import {PageWrapper, TextMedium} from "../../../../../../styles/components";
import {Word} from "../../../../../Word/Word";
import {WordsContainer} from "../../../Words/components";


const DictHeader = styled.div`
  padding: 10px;
  border-bottom: 1px solid gray;
`

export const Dictionary = () => {
    const [userDict, setUserDict] = useState<DictT>()
    const user = useAppSelector(state => state.user.user)
    useEffect(() => {
        apiGetDicts().then(data => setUserDict(data))
    }, []);
    return (
        <>
            {userDict ? (
                <>
                    <DictHeader>
                        <TextMedium>{userDict.name}</TextMedium>
                        {/*TODO: ADD INPUT TO WRITE NAME OR CHANGE IT */}
                    </DictHeader>
                    <WordsContainer>
                        {userDict.words.map(word => (
                            <Word word={word}/>
                        ))}
                    </WordsContainer>
                </>
            ) : (
                <div>
                    <button onClick={() => {
                        apiCreateDict("123", user.id).then(data => console.log(data))
                    }}>Create dictionary
                    </button>
                </div>
            )}
        </>
    )
};