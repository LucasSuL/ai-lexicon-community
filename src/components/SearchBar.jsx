import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
} from 'react-instantsearch-dom';

// Replace with your own Algolia application ID and search-only API key
const searchClient = algoliasearch(
  'ZZE8914XSX',
  'e5db34d12b9bb29637d777a76ec44717'
);

const SearchBar = () => {
  return (
    <InstantSearch searchClient={searchClient} indexName="test_FIRST">
      <SearchBox className='container'/>
      {/* <Hits hitComponent={Hit} /> */}
    </InstantSearch>
  );
};

const Hit = ({ hit }) => (
  <div>
    <p><Highlight attribute="head" hit={hit} tagName="mark" /></p>
    <p><Highlight attribute="text" hit={hit} tagName="mark" /></p>
  </div>
);

export { SearchBar, Hit };
