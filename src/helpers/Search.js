import React, { useState } from "react";

function Search({ query }) {

  const [searchTerm, setSearchTerm] = useState("");

  function handleSubmit(evt) {
    evt.preventDefault();
    query(searchTerm.trim() || undefined);
    setSearchTerm(searchTerm.trim());
  }

  function handleChange(evt) {
    setSearchTerm(evt.target.value);
  }

  return (
    <div className="Search mb-4">
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          className="form-control form-control-lg flex-grow-1"
          name="searchTerm"
          placeholder="Enter search term.."
          value={searchTerm}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-lg btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Search;
