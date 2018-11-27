import React, { Component } from 'react';
import './searchBar.css';

class AdvancedSearchBar extends Component {
  // defaults
  state = {
    skill: "Java",
    score: "5"
  };

  handleSkillChange = this.handleSkillChange.bind(this);
  handleScoreChange = this.handleScoreChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);

  handleSkillChange(event) {
    this.setState({ skill: event.target.value });
  }

  handleScoreChange(event) {
    this.setState({ score: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onGetProfile(this.state);
  }
  
  render() {
    return (
      <form className="form-inline m-2" onSubmit={this.handleSubmit}>
        <select id="skill" onChange={this.handleSkillChange} value={this.state.skill}>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
        </select>

        <select id="score" onChange={this.handleScoreChange} value={this.state.score}>
            <option value="5">Top 5%</option>
            <option value="10">Top 10%</option>
            <option value="25">Top 25%</option>
        </select>

        <button
          className="btn btn-outline-success my-2 my-sm-0"
          type="button"
          onClick={this.handleSubmit}
        >
          Search
        </button>
      </form>
    );
  }
}

export default AdvancedSearchBar;