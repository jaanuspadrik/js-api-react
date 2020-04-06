import React from 'react';
import './SearchForm.css';

export const SearchForm = (props) => {
    return (
      <div className="search">
        <form id="valik" onSubmit={props.getLocation}>
          <input type="text" name="location"/>
          <input type="submit" value="Otsi" />
        </form>
      </div>
    )
}
