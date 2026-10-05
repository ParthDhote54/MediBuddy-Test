function SearchBar({ value, onChange, onSearch, isLoading }) {
  return (
    <form
      className="search-bar"
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value);
      }}
    >
      <label htmlFor="medicine-search" className="sr-only">
        Search medicines by brand name
      </label>
      <input
        id="medicine-search"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter medicine name..."
        aria-label="Medicine brand name"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
}

export default SearchBar;
