import React from 'react';
import ReactDOM from 'react-dom';

export default ({query}) => {
  let row;

  if (query) {
    row = (
      <tr>
        <th className="column-title">Title</th>
        <th>Relevance</th>
      </tr>
    )
  } else {
    row = (
      <tr>
        <th className="column-title">Title</th>
      </tr>
    )
  }

  return (
    <thead>
      {row}
    </thead>
  )
}
