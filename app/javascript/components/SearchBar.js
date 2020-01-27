import React from "react"
import PropTypes from "prop-types"

const SEARCH_TERM_LIMIT = 10; // only show 10 results

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      isFocused: false,
    };
  }

  onQueryChange = (event) => {
    this.setState({ isFocused: true });
    const newQuery = event.target.value;
    if (newQuery.length === 0) {
      this.setState({ results: [] });
      return
    }
    fetch(`/search/get?query=${newQuery}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }, // you need this line!
    }).then(response => response.json()) // convert the response to a json promise
    .then(results => {
      console.log(results);
      const owners = results.owners.slice(0, SEARCH_TERM_LIMIT).map(owner => ({
        label: `${owner.first_name} ${owner.last_name}`, value: `/owners/${owner.id}`
      }));
      this.setState({ results: owners });
    });
  }

  renderResults = () => {
    if (!this.state.results || this.state.results.length === 0) {
      return null
    }
    return (
      <div>
        {this.state.results.map(res => (
          <div key={res.label} style={{ border: '1px solid black', padding: '3px'}}>
            <a href={res.value}>{res.label}</a>
          </div>
        ))}
      </div>
    );
  }

  hideResults = () => {
    this.setState({ isFocused: false });
  }

  render () {
    return (
      <React.Fragment>
        <input
          onChange={this.onQueryChange}
          onBlur={this.hideResults}
          placeholder="Search for owners..."
        />
        { this.state.isFocused ? (
          <div>
            {this.renderResults()}
          </div>
        ) : null }
     </React.Fragment>
    );
  }
}

export default SearchBar
