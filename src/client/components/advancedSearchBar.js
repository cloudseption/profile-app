import React, { Component } from 'react';
import './advancedSearchBar.css';

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
    return (<form className="form-inline m-2" onSubmit={this.handleSubmit}>
        <select id="skill" className="multi" onChange={this.handleSkillChange} value={this.state.skill}>
            <option value="java">Java</option>
            <option value="javascipt">Javascript</option>
            <option value="hangman">Hangman</option>
            <option value="tankgame">Tank Game</option>
        </select>
        <select id="score" className="multi" onChange={this.handleScoreChange} value={this.state.score}>
            <option value="5">Top 5%</option>
            <option value="10">Top 10%</option>
            <option value="20">Top 20%</option>
            <option value="30">Top 30%</option>
            <option value="40">Top 40%</option>
            <option value="50">Top 50%</option>
        </select>

        <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={this.handleSubmit}>
            Search
        </button>
    </form>)
  }
}

export default AdvancedSearchBar;