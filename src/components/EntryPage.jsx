import React from 'react';
import { useParams } from 'react-router-dom';

const EntryPage = ({ factList }) => {
  const { id } = useParams(); 

  const fact = factList.find(fact => fact.id === id);


  return (
    <div>
      <h2>{fact.text}</h2>
      <p>{fact.source}</p>
    </div>
  );
}

export default EntryPage;
