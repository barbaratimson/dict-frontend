import {useEffect, useState} from "react";
import {apiGetWords, apiSearchAllWords} from "../../../../utils/apiRequests";
import {WordT} from "../UserPage/UserPage";
import {Word} from "../../../Word/Word";
import {Input} from "../../../Input/Input";
import Search from "../../../Search/Search";
import * as React from "react";

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

    if (!words) return <div>No words</div>
    return (
        <div>
            <div className="flex flex-row justify-between items-center">
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
    );
};