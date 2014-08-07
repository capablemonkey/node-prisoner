var _ = require('underscore');

function SimultaneousGame(duration) {
	this.players = [];
	this.duration = duration;
	this.currentTurn = 0;
	this.moveHistory = [];
}

// move: 
// {
// 	turn: 2,
// 	player: p,
// 	choice: 2
// }

SimultaneousGame.prototype.makeMove = function(player, move) {
	if (!_.contains(player.possibleMoves, move)) {throw new Error('Player cannot make that move!');}

	this.moveHistory.push({
		turn: this.currentTurn,
		player: player,
		choice: move
	});

	// check if end of turn... if all players have made a move
	if (_.where(this.moveHistory, {turn: this.currentTurn}).length === this.players.length) {
		this.endTurn();
	}
};

SimultaneousGame.prototype.endTurn = function() {
	var movesThisTurn = _.where(this.moveHistory, {turn: this.currentTurn});

	// end turn, calculate payoffs 

	// TODO: refactor.  Hacky and only applies to prisoner's dilemma...
	var payoffPlayerOne = movesThisTurn[0].player.payoffs[movesThisTurn[0].choice][movesThisTurn[1].choice];
	this.players[0].score += payoffPlayerOne;
	this.players[0].scoreHistory.push(this.players[0].score);

	var payoffPlayerTwo = movesThisTurn[1].player.payoffs[movesThisTurn[1].choice][movesThisTurn[0].choice];
	this.players[1].score += payoffPlayerTwo;
	this.players[1].scoreHistory.push(this.players[1].score);

	// begin new turn
	this.currentTurn += 1;
}

function Player(payoffs, possibleMoves, initialScore) {
	this.payoffs = payoffs;
	this.possibleMoves = possibleMoves;
	this.score = initialScore || 0;
	this.scoreHistory = [this.score];
}

/*
Payoff:

payoff['mymove']['theirmove']
payoff['cooperate']['defect']

{
	'defect': {
		'cooperate': 5,
		'defect': -2 
	},
	'cooperate': {
		'cooperate': 2,
		'defect': -5
	}
}
*/

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

var p1 = new Player(PRISONER_PAYOFFS, PRISONER_MOVES, 0);
var p2 = new Player(PRISONER_PAYOFFS, PRISONER_MOVES, 0);

var game = new SimultaneousGame(10);
game.players.push(p1);
game.players.push(p2);

game.makeMove(p1, 'defect');
game.makeMove(p2, 'cooperate');

console.log(game.moveHistory);
console.log(game.players);

module.exports = SimultaneousGame;