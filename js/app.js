'use strict';

function playerFactory(name, symbol) {
  const personPrototype = {
    setName(name) {
      this.name = name;
    },
    setSymbol(symbol) {
      this.symbol = symbol;
    },
    setMove(id) {
      this.moves.push(id);
    },
  };

  const person = Object.create(personPrototype);
  person.moves = [];

  return person;
}

const displayController = (function () {})();

const gameController = (function () {})();
