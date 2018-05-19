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
          <input type="text" autoFocus="on" spellCheck="false"
            className="main-search" maxLength="512" placeholder="Card Search"
            value={this.state.value} onChange={this.handleChange} />
          <button id="advanced" onClick={this.handleClick}>
            Advanced
          </button>
          <div className={this.state.advanced ? "advanced-show" : "advanced-hide"}>
            <div className="mana-filters adv-section">
              <i className="ms ms-w ms-cost"></i>
              <i className="ms ms-u ms-cost"></i>
              <i className="ms ms-b ms-cost"></i>
              <i className="ms ms-r ms-cost"></i>
              <i className="ms ms-g ms-cost"></i>
              <i className="ms ms-c ms-cost"></i>
            </div>
            <input className="oracle hdr-input adv-section" placeholder="Oracle Text"
              type="text" spellCheck="false" maxLength="512" />
            <input className="type-line hdr-input adv-section" placeholder="Type Line"
              type="text" spellCheck="false" maxLength="512" />
            <div className="legality adv-section">
              <select>
                <option value="any">Format: Any</option>
                <option value="standard">Standard</option>
                <option value="modern">Modern</option>
                <option value="legacy">Legacy</option>
                <option value="vintage">Vintage</option>
                <option value="pauper">Pauper</option>
                <option value="commender">Commander</option>
              </select>
            </div>
            <div className="rarity adv-section">
              <select>
                <option value="any">Rarity: Any</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="mythic">Mythic Rare</option>
              </select>
            </div>
          </div>
        </div>
        <div className="DeckBox">{cardElements}</div>
      </div>
    );
  }
}
