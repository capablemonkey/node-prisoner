
module.exports.titForTat = function(game, player, otherPlayer) {
	if (game.currentTurn === 0) return 'cooperate';

	var opponentsLastMove = otherPlayer.moveHistory[game.currentTurn - 1];
	return opponentsLastMove.choice;
};
