import React from 'react';
import {useState} from 'react';
import Search from '../Search';
import Houses from '../Houses';
import { useLazyQuery} from '@apollo/client/react';
import {gql} from "@apollo/client";

const SEARCH_HOUSES = gql`
    query SearchHouses($search: String!) {
        housesCollection(filter: { name: { ilike: $search } }) {
            edges {
                node {
                    id
                    name
                    address
                }
            }      
        }
    }
`;

const HousesSearch = () => {
    const [input, setInput] = useState("");
    const [search, { loading, error, data }] = useLazyQuery(SEARCH_HOUSES);

    return (
        <div>
            <Search 
                input={input}
                onChange={(e) => setInput(e.target.value)}
                onSearch={() => search({ variables: { search: `%${input}%` } })}
            />
            <Houses newHouses={data ? data.housesCollection.edges.map(edge => edge.node) : null}/>
        </div>
    );
}

export default HousesSearch;