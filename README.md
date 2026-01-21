# FASERIP System for Foundry VTT

![Foundry v11](https://img.shields.io/badge/foundry-v11-green)

An implementation of the FASERIP (Marvel Super Heroes) game system for Foundry Virtual Tabletop.

## About FASERIP

FASERIP is a superhero role-playing game system based on the classic Marvel Super Heroes RPG. The system uses a simple percentile-based resolution mechanic with the Universal Results Table to determine the outcome of actions.

## Core Game Mechanics

### The Seven Attributes

Every character in FASERIP has seven primary attributes that define their capabilities:

- **Fighting (F)** - Combat skill and hand-to-hand prowess
- **Agility (A)** - Dexterity, reflexes, and coordination
- **Strength (S)** - Physical power and muscle
- **Endurance (E)** - Stamina, health, and resistance to damage
- **Reason (R)** - Intelligence and logic
- **Intuition (I)** - Awareness and willpower
- **Psyche (P)** - Mental and psychic power

### The Rank System

Each attribute is assigned a rank that determines both its numerical value and its effectiveness:

| Rank | Value | Description |
|------|-------|-------------|
| Feeble | 2 | Well below human average |
| Poor | 4 | Below human average |
| Typical | 6 | Human average |
| Good | 10 | Above human average |
| Excellent | 20 | Peak human capability |
| Remarkable | 30 | Low superhuman level |
| Incredible | 40 | Mid superhuman level |
| Amazing | 50 | High superhuman level |
| Monstrous | 75 | Very high superhuman level |
| Unearthly | 100 | Cosmic level power |

Higher ranks include Shift X, Shift Y, Shift Z, and Class 1000+.

### Universal Results Table

Actions are resolved by rolling percentile dice (d100) and comparing the result against a column determined by the character's relevant attribute rank. The table provides different levels of success:

- **White** - Failure
- **Green** - Marginal Success
- **Yellow** - Standard Success
- **Red** - Exceptional Success

### Character Types

- **Characters** - Player characters with full attribute arrays and customization
- **NPCs** - Non-player characters for villains, allies, and extras

### Item Types

- **Powers** - Superhuman abilities and special capabilities
- **Talents** - Learned skills and professional expertise
- **Resources** - Equipment, wealth, and contacts

## Installation

### Method 1: Manifest URL (Recommended when published)

1. In Foundry VTT, go to "Game Systems"
2. Click "Install System"
3. Paste the manifest URL: `https://github.com/worldsofwondergames/faserip/releases/latest/download/system.json`
4. Click "Install"

### Method 2: Manual Installation

1. Download the latest release from the [Releases page](https://github.com/worldsofwondergames/faserip/releases)
2. Extract the ZIP file to your Foundry VTT `Data/systems` folder
3. Restart Foundry VTT
4. Create a new world and select "FASERIP" as the game system

## Features

- Full implementation of the seven FASERIP attributes
- Character and NPC actor types
- Powers, Talents, and Resources item types
- DataModel architecture for extensibility
- Responsive character sheets
- Support for Foundry VTT v11+

## Development

This system is built using the Foundry VTT system boilerplate with DataModels enabled.

### Building from Source

```bash
# Install dependencies
npm install

# Build CSS from SCSS
npm run build

# Watch for changes during development
npm run watch
```

## Sheet Layout Helper Classes

This system includes helpful CSS classes for laying out your sheets:

- `flexcol`: Lays out child elements vertically
- `flexrow`: Lays out child elements horizontally
- `flex-center`: Centers items and text
- `flex-between`: Places space between items
- `flex-group-center`: Add border, padding, and center items
- `flex-group-left`: Add border, padding, and left align items
- `flex-group-right`: Add border, padding, and right align items
- `grid`: When combined with `grid-Ncol`, creates grid layouts
- `grid-Ncol`: Replace N with 1-12 for column count

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests on the [GitHub repository](https://github.com/worldsofwondergames/faserip).

## Getting Help

- [Official Foundry VTT Discord](https://discord.gg/foundryvtt) - #system-development channel
- [Knowledge Base](https://foundryvtt.com/kb/)
- [API Documentation](https://foundryvtt.com/api/)

## License

This project is licensed under the terms specified in [LICENSE.txt](LICENSE.txt).

## Credits

- **System Development**: Worlds of Wonder Games
- **Built on**: [Foundry VTT Boilerplate](https://github.com/asacolips-projects/boilerplate) by Asacolips

## Support

For issues, questions, or suggestions, please visit the [GitHub Issues page](https://github.com/worldsofwondergames/faserip/issues).

---

*FASERIP is based on the Marvel Super Heroes role-playing game. This is a fan-made implementation and is not officially affiliated with Marvel or Disney.*
