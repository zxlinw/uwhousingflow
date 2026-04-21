import React from 'react';
import {useState} from 'react';
import InputForm from './InputForm';
import Houses from '../Houses';
import { useLazyQuery} from '@apollo/client/react';
import {gql} from "@apollo/client";
import PageShell from './PageShell';

const SEARCH_HOUSES = gql`
    query SearchHouses($search: String!) {
                housesCollection(
                    filter: {
                        or: [
                            { name: { ilike: $search } }
                            { address: { ilike: $search } }
                        ]
                    }
                ) {
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
    const houses = data ? data.housesCollection.edges.map(edge => edge.node) : null;

    return (
        <PageShell
          title="Find Your Next UW Home"
          subtitle="Search by house name or by address, then open a listing to browse detailed student reviews."
          navItems={[]}
        >
          <InputForm 
              input={input}
              onChange={(e) => setInput(e.target.value)}
              onSubmit={() => search({ variables: { search: `%${input}%` } })}
          />
          <Houses newHouses={houses} loading={loading} error={error} />
        </PageShell>
    );
}

export default HousesSearch;