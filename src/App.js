import React, { Component } from 'react';
import './App.css';
import Notyf from './notyf/dist/notyf.min.js';
import Card from './Card.js';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      error: false,
      loaded: false,
      data: null,
      advanced: false,
      colors: {
        w: true,
        u: true,
        b: true,
        r: true,
        g: true
      },
      oracle: '',
      typeline: '',
      format: 'any',
      rarity: 'any'
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
    const eventClass = event.target.className;
    let searchValue = this.state.searchValue;
    let colors = this.state.colors;
    let oracle = this.state.oracle;
    let typeline = this.state.typeline;
    let format = this.state.format;
    let rarity = this.state.rarity;
    if (eventClass.includes('ms-cost')) {
      const color = event.target.id.replace('ms-', '');
      colors = this.state.colors;
      colors[color] = !colors[color];
      this.setState(colors: colors);
    } else if (eventClass.includes('main-search')) {
      searchValue = event.target.value;
      this.setState({searchValue: searchValue});
    } else if (eventClass.includes('oracle')) {
      oracle = event.target.value;
      this.setState({'oracle': oracle});
    } else if (eventClass.includes('type-line')) {
      typeline = event.target.value;
      this.setState({'typeline': typeline});
    } else if (eventClass.includes('legality')) {
      format = event.target.value;
      this.setState({'format': format});
    } else if (eventClass.includes('rarity')) {
      rarity = event.target.value;
      this.setState({'rarity': rarity});
    }
    // build out out search string: https://scryfall.com/docs/reference
    // using a counter to determine when a query is legitimate/non-empty
    let counter = 0;
    let query = searchValue;
    if (oracle.length >= 4) {
      query = query + ' o:"' + oracle + '"';
      counter++;
    }
    if (typeline.length >= 4) {
      query = query + ' t:"' + typeline + '"';
      counter++;
    }
    let colorQuery = Object.keys(colors).filter(function(x){return colors[x]}).join('');
    if (colorQuery === '') colorQuery = 'c';
    query = query + ' c<=' + colorQuery;
    if (format !== 'any' && format !== '') {
      query = query + ' f:' + format;
      counter++;
    }
    if (rarity !== 'any' && rarity !== '') {
      query = query + ' r:' + rarity;
      counter++;
    }
    if (searchValue.length >= 4) counter++;
    // TODO: find a more advanced way to find "legitimate" searches
    // should be able to support browsing format + colors, etc.
    if (counter >= 2 || searchValue.length >= 4) {
      const searchApi = 'https://api.scryfall.com/cards/search/?q=' + encodeURIComponent(query);
      fetch(searchApi)
        .then(res => res.json())
        .then((result) => this.displayCards(result),
        (error) => {
          this.setState({
            loaded: true,
            error
          });
          new Notyf().alert('An error occurred, please retry your search.');
        });
    } else if (searchValue.length < 1) {
      this.setState({
        loaded: false,
        data: null
      });
    }
  }

  handleClick(event) {
    console.log(event.target.className);
    this.setState({
      advanced: !this.state.advanced
    });
  }

  render() {
    const cards = this.state.data;
    let cardElements = [];
    if (cards !== null && typeof(cards) !== 'undefined' && cards.length > 0) {
      cardElements = cards.map(card =>
        <Card image={typeof card.image_uris === 'undefined' ?
            card.card_faces[0].image_uris.normal :
            card.image_uris.normal}
          name={card.name} link={card.scryfall_uri} key={card.id} />
      );
    }
    const colorClass = ['w','u','b','r','g'].map(color =>
      `ms ms-${color} ms-cost ${this.state.colors[color] ? '' : 'ms-deselect'}`
    );
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
            <div className="legality adv-section">
              <select className="legality-select" onChange={this.handleChange}>
                <option value="any">Format: Any</option>
                <option value="standard">Standard</option>
                <option value="modern">Modern</option>
                <option value="legacy">Legacy</option>
                <option value="vintage">Vintage</option>
                <option value="pauper">Pauper</option>
                <option value="commender">Commander</option>
              </select>
            </div>
            <input className="type-line hdr-input adv-section" placeholder="Type Line"
              type="text" spellCheck="false" maxLength="512" onChange={this.handleChange} />
            <input className="oracle hdr-input adv-section" placeholder="Oracle Text"
              type="text" spellCheck="false" maxLength="512" onChange={this.handleChange} />
            <div className="rarity adv-section">
              <select className="rarity-select" onChange={this.handleChange}>
                <option value="any">Rarity: Any</option>
                <option value="common">Common</option>
                <option value="uncommon">Uncommon</option>
                <option value="rare">Rare</option>
                <option value="mythic">Mythic Rare</option>
              </select>
            </div>
            <div className="mana-filters adv-section">
              <i onClick={this.handleChange} id="ms-w" className={colorClass[0]}></i>
              <i onClick={this.handleChange} id="ms-u" className={colorClass[1]}></i>
              <i onClick={this.handleChange} id="ms-b" className={colorClass[2]}></i>
              <i onClick={this.handleChange} id="ms-r" className={colorClass[3]}></i>
              <i onClick={this.handleChange} id="ms-g" className={colorClass[4]}></i>
            </div>
          </div>
        </div>
        <div className="DeckBox">{cardElements}</div>
      </div>
    );
  }
}
