import React from 'react';
import ReactDOM from 'react-dom';

export default (props) => {
  return (
    <input
      className="u-full-width"
      type="text"
      placeholder="Search song"
      onChange={props.handleQueryChange}
      defaultValue={props.query}
      />
  )
}
