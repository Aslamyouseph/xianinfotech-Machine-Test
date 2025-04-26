import React, { useContext } from "react";
import "./SearchBar.css";
import Form from "react-bootstrap/Form";
import { SearchContext } from "../../SearchContext.js";

function SearchBar() {
  const { search, setSearch } = useContext(SearchContext);

  return (
    <div className="search-bar-container">
      <Form className="d-flex">
        <Form.Control
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="search"
          placeholder="Search your feed"
          className="search-bar"
          aria-label="Search"
        />
      </Form>
    </div>
  );
}

export default SearchBar;
