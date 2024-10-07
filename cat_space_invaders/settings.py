class Settings:
    """A class to store all settings for Alien Invasion"""

    def __init__(self):
        """Initialize game's static settings"""
        # Screen settings
        self.screen_width = 1200
        self.screen_height = 800
        self.bg_color = (200, 190, 237)

        # Ship settings
        self.ship_speed = 2.5
        self.ship_limit = 3

        # Bullet settings
        self.bullet_speed = 3.0
        self.bullet_width = 4
        self.bullet_height = 20
        self.bullet_color = (63, 62, 79)
        self.bullets_allowed = 3

        # Alien settings
        self.alien_speed = 1.0
        self.fleet_drop_speed = 10

        # Pace at which game speeds up
        self.speedup_scale = 1.1

        # pace at which point value increases
        self.score_scale = 1.5

        self.initialize_dynamic_settings()

    def initialize_dynamic_settings(self):
        """Initialize settings that changes throughout the game"""
        self.ship_speed = 2.5
        self.bullet_speed = 3.5
        self.alien_speed = 1.0

        # Fleet direction
        self.fleet_direction = 1

        # score settings
        self.alien_points = 50

    def increase_speed(self):
        """Increase speed settings"""
        self.ship_speed *= self.speedup_scale
        self.bullet_speed *= self.speedup_scale
        self.alien_speed *= self.speedup_scale

        self.alien_points = int(self.alien_points * self.score_scale)
        

            



