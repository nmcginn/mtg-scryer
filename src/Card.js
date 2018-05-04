import React, { Component } from 'react';

export default class Card extends Component {
  render() {
    return (
      <div className="Card">
        <a href={this.props.link} target="_blank">
          <img className="CardArt" src={this.props.image} alt={this.props.name} />
        </a>
      </div>
    );
  }
}
