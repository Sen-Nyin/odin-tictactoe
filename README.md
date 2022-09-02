# Tic Tac Toe

A game built for [The Odin Project](http://www.theodinproject.com).

## About

The project has been built with a neumorphism design using off-white shades and light grey shadows, complimented with a medium-dark grey text.

The font used is Ubuntu at weights 300, 400, and 700.

Gamers have the option to play vs a friend or vs the AI. Human players are required to enter a name, while the AI name defaults to 'Computer'.

The symbols for both X and O are 100% css generated and are handled by some very specific selectors. This includes the hover-state symbols.

The AI utilises minimax recursion such that it's unbeatable - so good luck!

The project utilises factories and modules with closures to keep the global scope clean - in fact, nothing at all is available in the global scope for access by the user.

## Stack Used

- HTML 5
- Sass -> CSS
- JS

## Difficulties Faced

### Understanding Closures

The first difficulty was understanding how the page was going to access methods after they've been created in an IIFE. However, I was looking at it all wrong - I had, until this point, believed that the engine would look at the JS file each time it needed to access a function, or method. Once I realised that the file would execute once to store the objects into memory, and the engine would use those objects from thereon out, things became easier.

### Neck-deep CSS selectors

Having spent such a long time on JS I felt I was beginning to forget some of my Sass ability, so I decided to create some of the functionality using only Sass/CSS. Enter the symbols. Getting these very specific selectors working took some time, but the sense of achievement when they finally did work was well worth it.

### Minimax AI

Ahh, recursion (AHHHHGGHGHG!). Using recursion to create an unbeatable AI was a real challenge - indeed I decided not to implement a beatable AI at all and went straight for the big bonus challenge. I understood what I needed to do and how it should work, but didn't really know how to implement it. This was made even more difficult by my choice to use pure CSS for the symbols and I therefore had to do quite a bit of refactoring of my code to create an array-based gameboard, rather than simply using a nodelist.

I followed a video guide by freeCodeCamp to help understand how to do this, and then tinkered with their solution to fit with my own code structure.

## Learnings

These are not so much learnings, but more like opportunities to practice some array methods that I had read about, but never utilised until this point. They are:

- find()
- every()
- some()
- filter()
- fill()
- Array.from()
- new Array()

Note: not all of them made it into the final code, but most of them did.

## Resources

[freeCodeCamp - TicTacToe - AI Guide](https://www.youtube.com/watch?v=Y-GkMjUZsmM)

## Shout Outs

From The Odin Project discord community, big shout outs to both of the following for keeping me on point and helping me overcome some impostor syndrome.

tobyPlaysTheUke
JMyers
