class GameStats:
    """Track game stats for Alien Invasion"""

    def __init__(self, ai_game):
        """Initialize stats"""
        self.settings = ai_game.settings
        self.reset_stats()

        # don't reset high score
        self.high_score = 0

    def reset_stats(self):
        """Initialize the stats that can change during the game"""
        self.ships_left = self.settings.ship_limit
        self.score = 0
        self.level = 1