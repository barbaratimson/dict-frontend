import * as React from 'react';
import {Dictionary} from "./components/Dictionary/Dictionary";
import {PageWrapper} from "../../../../styles/components";

export interface DictT {
    id: string
    name: string
    owner: number
    words: WordT[]
}

export interface WordT {
    id: number
    value: string
    translate: string
}

const UserPage = () => {


    return (
        <PageWrapper>
            <Dictionary/>
        </PageWrapper>
    );
}


export default UserPage;