import React, { Component } from 'react';
import './App.css';
import Card from './Card.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      error: false,
      loaded: false,
      data: null,
      advanced: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.displayCards = this.displayCards.bind(this);
  }

  displayCards(result) {
    this.setState({
      loaded: true,
      data: result['data']
    });
  }

  handleChange(event) {
    const searchValue = event.target.value;
    this.setState({searchValue: searchValue});
    if (searchValue.length >= 4) {
      const searchApi = 'https://api.scryfall.com/cards/search/?q=' + encodeURIComponent(searchValue);
      fetch(searchApi)
        .then(res => res.json())
        .then((result) => this.displayCards(result),
        (error) => {
          this.setState({
            loaded: true,
            error
          });
        });
    } else if (searchValue.length < 1) {
      this.setState({
        loaded: false,
        data: null
      });
    }
  }

  handleClick(event) {
    this.setState({
      advanced: !this.state.advanced
    });
  }

  render() {
    const cards = this.state.data;
    let cardElements = [];
    if (cards !== null && cards.length > 0) {
      cardElements = cards.map(card =>
        <Card image={typeof card.image_uris === 'undefined' ?
            card.card_faces[0].image_uris.normal :
            card.image_uris.normal}
          name={card.name} link={card.scryfall_uri} key={card.id} />
      );
    }
    return(
      <div className="App">
        <div className="header">
          <input type="text" autoFocus="on" spellCheck="false" maxLength="512"
            value={this.state.value} onChange={this.handleChange} />
          <button id="advanced" onClick={this.handleClick}>
            Advanced
          </button>
        </div>
        <div className="DeckBox">{cardElements}</div>
      </div>
    );
  }
}
