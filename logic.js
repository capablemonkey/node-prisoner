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
	if (this.currentTurn >= this.duration) {throw new Error('Game has already ended!');}

	moveHistoryItem = {
		turn: this.currentTurn,
		player: player,
		choice: move
	};

	this.moveHistory.push(moveHistoryItem);
	player.moveHistory.push(moveHistoryItem);

	// check if end of turn... if all players have made a move
	if (_.where(this.moveHistory, {turn: this.currentTurn}).length === this.players.length) {
		this.endTurn();
	}
	else {
		// otherwise, maybe there is an AI who needs to make a move
		var otherPlayer = _.reject(this.players, function(p) {if (p.name === player.name) return true;})[0];
		if (otherPlayer.strategy !== null) otherPlayer.playStrategy(this);
	}

	return true;
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

function Player(name, payoffs, possibleMoves, strategy, initialScore) {
	this.name = name;
	this.payoffs = payoffs;
	this.possibleMoves = possibleMoves;
	this.score = initialScore || 0;
	this.scoreHistory = [this.score];
	this.strategy = strategy;
	this.moveHistory = [];
}

Player.prototype.playStrategy = function(game) {
	var player = this;

	// hacky... get the other player by removing yourself from the player pool and choosing first element.  only works if there are 2 players...
	var otherPlayer = _.reject(game.players, function(p) {if (p.name === player.name) return true;})[0];
	var move = this.strategy(game, player, otherPlayer);
	game.makeMove(this, move);
};

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

var strategyTitForTat = function(game, player, otherPlayer) {
	if (game.currentTurn === 0) return 'cooperate';

	var opponentsLastMove = otherPlayer.moveHistory[game.currentTurn - 1].choice;
	return opponentsLastMove;
};

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

var p1 = new Player('joe', PRISONER_PAYOFFS, PRISONER_MOVES, null, 0);
var p2 = new Player('rob', PRISONER_PAYOFFS, PRISONER_MOVES, strategyTitForTat, 0);

var game = new SimultaneousGame(10);
game.players.push(p1);
game.players.push(p2);

game.makeMove(p1, 'defect');
game.makeMove(p1, 'defect');
game.makeMove(p1, 'defect');
game.makeMove(p1, 'defect');
game.makeMove(p1, 'cooperate');
game.makeMove(p1, 'cooperate');

console.log(game.moveHistory);
console.log(game.players);

module.exports = SimultaneousGame;