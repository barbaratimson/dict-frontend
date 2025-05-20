import * as React from 'react';
import { Dictionary } from "../../../Dictionary/Dictionary";

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
        <div>
            <Dictionary/>
        </div>
    );
}


export default UserPage;