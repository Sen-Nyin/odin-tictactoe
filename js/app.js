'use strict';

function playerFactory(name, symbol) {
  const personPrototype = {};

  const person = Object.create(personPrototype);
  person.name = name;
  person.symbol = symbol;

  return person;
}

const displayController = (function () {})();

const gameController = (function () {})();
