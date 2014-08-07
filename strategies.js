var _ = require('underscore');

module.exports.titForTat = function(game, player, otherPlayer) {
	if (game.currentTurn === 0) return 'cooperate';

	var opponentsLastMove = otherPlayer.moveHistory[game.currentTurn - 1];
	return opponentsLastMove.choice;
};

module.exports.alwaysDefect = function(game, player, otherPlayer) {
	return 'defect';
};

module.exports.alwaysCooperate = function(game, player, otherPlayer) {
	return 'cooperate';
};

module.exports.grudger = function(game, player, otherPlayer) {
	if (game.currentTurn === 0) return 'cooperate';

	// bool, has other player ever defected?
	var everDefected = _.some(otherPlayer.moveHistory, function(historyItem) {
		if (historyItem.choice === 'defect') return true;
	});

	if (everDefected) return 'defect';
	else return 'cooperate';
};