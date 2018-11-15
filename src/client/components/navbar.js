import React, { Component } from 'react';

class NavBar extends Component {

    state = { value: '' };

    handleChange = this.handleChange.bind(this);
    handleSubmit = this.handleSubmit.bind(this);

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onGetProfile(this.state.value);
    }

    render() {
        return <nav className="navbar navbar-light bg-light">
            <form className="form-inline" onSubmit={this.handleSubmit}>
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" value={this.state.value} onChange={this.handleChange} />
              <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={this.handleSubmit}>
                Search
              </button>
            </form>
          </nav>;
    }

    getSearchText() {
        
    }
}

export default NavBar;