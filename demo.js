var logic = require('./logic.js');
var strategies = require('./strategies.js');
var _ = require('underscore');

var PRISONER_PAYOFFS = {
	'defect': {
		'cooperate': 5,
		'defect': -2 
	},
	'cooperate': {
		'cooperate': 2,
		'defect': -5
	}
};

var PRISONER_MOVES = ['cooperate', 'defect'];

var p1 = new logic.Player('joe', PRISONER_PAYOFFS, PRISONER_MOVES, strategies.titForTat, 0);
var p2 = new logic.Player('rob', PRISONER_PAYOFFS, PRISONER_MOVES, strategies.titForTat, 0);

var game = new logic.PrisonersGame(10);
game.players.push(p1);
game.players.push(p2);

// game.makeMove(p1, 'defect');

_.range(game.duration).forEach(function() {p1.playStrategy(game)});

console.log(game.moveHistory);
console.log(game.players);