import {Input, PageWrapper, TextLarge} from "../../../../styles/components";
import {useEffect, useState} from "react";
import {apiGetWords, apiSearchAllWords} from "../../../../utils/apiRequests";
import {WordT} from "../UserPage/UserPage";
import {Word} from "../../../Word/Word";
import {WordsContainer} from "./components";

export const Words = () => {
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

    if (!words) return <TextLarge>No words</TextLarge>
    return (
        <PageWrapper>
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search words"/>
            <WordsContainer>
                {!searchResults ? words?.map(word => (
                    <Word key={word.id} word={word}/>
                )) : searchResults?.length !== 0 ? searchResults?.map(word => (
                    <Word key={word.id} word={word}/>
                )) : (
                    <TextLarge>No words found :(</TextLarge>
                )}
            </WordsContainer>
        </PageWrapper>
    );
};