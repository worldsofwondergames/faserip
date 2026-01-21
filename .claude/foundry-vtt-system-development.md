# Foundry VTT System Development Guide

Complete reference for developing game systems in Foundry Virtual Tabletop.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Core Files](#core-files)
3. [Data Models](#data-models)
4. [Document Types](#document-types)
5. [Sheets](#sheets)
6. [Templates](#templates)
7. [Styling](#styling)
8. [Hooks and Events](#hooks-and-events)
9. [Rolls and Dice](#rolls-and-dice)
10. [Active Effects](#active-effects)
11. [Best Practices](#best-practices)

---

## System Architecture

### Directory Structure

```
your-system/
├── .git/
├── .github/
│   └── workflows/
├── assets/              # Images, icons, logos
├── css/                 # Compiled CSS
├── lang/                # Localization files
│   └── en.json
├── lib/                 # Third-party libraries
├── module/              # JavaScript modules
│   ├── documents/       # Document class extensions
│   │   ├── actor.mjs
│   │   └── item.mjs
│   ├── sheets/          # Sheet classes
│   │   ├── actor-sheet.mjs
│   │   └── item-sheet.mjs
│   ├── helpers/         # Helper functions
│   │   ├── config.mjs
│   │   ├── templates.mjs
│   │   └── effects.mjs
│   └── your-system.mjs  # Main entry point
├── packs/               # Compendium packs
├── src/                 # Source files
│   ├── scss/            # SCSS source
│   └── datamodels/      # DataModel implementations (optional)
├── templates/           # Handlebars templates
│   ├── actor/
│   └── item/
├── .gitignore
├── LICENSE.txt
├── README.md
├── package.json         # NPM configuration for build tools
├── system.json          # System manifest (REQUIRED)
└── template.json        # Data template (REQUIRED if not using DataModels)
```

---

## Core Files

### system.json (Manifest)

The system manifest defines metadata and tells Foundry how to load the system.

```json
{
  "id": "your-system",
  "title": "Your System Name",
  "description": "Description of your game system",
  "version": "1.0.0",
  "compatibility": {
    "minimum": "11",
    "verified": "12",
    "maximum": "12"
  },
  "authors": [
    {
      "name": "Your Name",
      "url": "https://your-url.com",
      "discord": "username",
      "email": "email@example.com"
    }
  ],
  "url": "https://github.com/your/repo",
  "license": "LICENSE.txt",
  "readme": "README.md",
  "bugs": "https://github.com/your/repo/issues",
  "manifest": "https://github.com/your/repo/releases/latest/download/system.json",
  "download": "https://github.com/your/repo/releases/latest/download/your-system.zip",
  "esmodules": ["module/your-system.mjs"],
  "styles": ["css/your-system.css"],
  "languages": [
    {
      "lang": "en",
      "name": "English",
      "path": "lang/en.json"
    }
  ],
  "packs": [
    {
      "name": "items",
      "label": "System Items",
      "path": "packs/items",
      "type": "Item"
    }
  ],
  "documentTypes": {
    "Actor": {
      "character": {},
      "npc": {}
    },
    "Item": {
      "weapon": {},
      "armor": {},
      "spell": {}
    }
  },
  "grid": {
    "distance": 5,
    "units": "ft"
  },
  "primaryTokenAttribute": "health",
  "secondaryTokenAttribute": "power"
}
```

### template.json (Data Schema)

Defines the data structure for Actors and Items. **Not needed if using DataModels.**

```json
{
  "Actor": {
    "types": ["character", "npc"],
    "templates": {
      "base": {
        "health": {
          "value": 10,
          "min": 0,
          "max": 10
        },
        "biography": ""
      }
    },
    "character": {
      "templates": ["base"],
      "attributes": {
        "level": {
          "value": 1
        }
      },
      "abilities": {
        "str": {
          "value": 10,
          "mod": 0
        }
      }
    },
    "npc": {
      "templates": ["base"],
      "cr": 0
    }
  },
  "Item": {
    "types": ["weapon", "armor", "spell"],
    "templates": {
      "base": {
        "description": ""
      }
    },
    "weapon": {
      "templates": ["base"],
      "damage": "1d6",
      "range": 5
    }
  }
}
```

---

## Data Models

Modern approach using JavaScript classes instead of template.json.

### Base Model

```javascript
// module/data/base-model.mjs
export default class BaseDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField(),
    };
  }
}
```

### Actor Data Model

```javascript
// module/data/actor-character.mjs
import BaseDataModel from './base-model.mjs';

export default class CharacterData extends BaseDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.health = new fields.SchemaField({
      value: new fields.NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 10,
        min: 0
      }),
      max: new fields.NumberField({
        required: true,
        nullable: false,
        integer: true,
        initial: 10,
        min: 0
      })
    });

    schema.attributes = new fields.SchemaField({
      level: new fields.NumberField({
        required: true,
        integer: true,
        initial: 1,
        min: 1
      })
    });

    return schema;
  }

  prepareDerivedData() {
    // Calculate derived values
    this.health.max = 10 + (this.attributes.level * 5);
  }
}
```

### Registering Data Models

```javascript
// module/your-system.mjs
import CharacterData from './data/actor-character.mjs';
import NPCData from './data/actor-npc.mjs';

Hooks.once('init', function() {
  CONFIG.Actor.dataModels = {
    character: CharacterData,
    npc: NPCData
  };
});
```

---

## Document Types

### Custom Actor Class

```javascript
// module/documents/actor.mjs
export default class YourActor extends Actor {

  prepareData() {
    super.prepareData();
  }

  prepareBaseData() {
    // Prepare data before derived data
  }

  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.yoursystem || {};

    // Calculate modifiers, bonuses, etc
    this._prepareCharacterData(actorData);
  }

  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    const systemData = actorData.system;

    // Calculate ability modifiers
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      ability.mod = Math.floor((ability.value - 10) / 2);
    }
  }

  getRollData() {
    const data = {...super.getRollData()};

    // Add custom roll data
    if (this.type === 'character') {
      data.lvl = this.system.attributes.level.value;
    }

    return data;
  }

  async rollAbilityCheck(abilityId) {
    const ability = this.system.abilities[abilityId];
    const roll = await new Roll('1d20 + @mod', {
      mod: ability.mod
    }).evaluate();

    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${abilityId.toUpperCase()} Check`
    });

    return roll;
  }
}
```

### Custom Item Class

```javascript
// module/documents/item.mjs
export default class YourItem extends Item {

  prepareData() {
    super.prepareData();
  }

  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;
    const flags = itemData.flags.yoursystem || {};

    // Calculate item-specific data
  }

  getRollData() {
    if (!this.actor) return null;

    const rollData = this.actor.getRollData();
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  async roll() {
    const item = this;

    // Create chat message
    const messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: this.name,
      content: await renderTemplate('systems/yoursystem/templates/item/item-card.hbs', {
        item: item
      })
    };

    ChatMessage.create(messageData);
  }
}
```

### Registering Document Classes

```javascript
// module/your-system.mjs
import YourActor from './documents/actor.mjs';
import YourItem from './documents/item.mjs';

Hooks.once('init', function() {
  CONFIG.Actor.documentClass = YourActor;
  CONFIG.Item.documentClass = YourItem;
});
```

---

## Sheets

### Actor Sheet

```javascript
// module/sheets/actor-sheet.mjs
export default class YourActorSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['yoursystem', 'sheet', 'actor'],
      width: 600,
      height: 600,
      tabs: [{ navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'features' }]
    });
  }

  get template() {
    return `systems/yoursystem/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  async getData(options) {
    const context = super.getData(options);
    const actorData = this.document.toObject(false);

    context.system = actorData.system;
    context.flags = actorData.flags;
    context.config = CONFIG.YOURSYSTEM;

    // Prepare items
    context.items = actorData.items;
    context.items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

    // Prepare active effects
    context.effects = this._prepareEffects();

    // Add roll data
    context.rollData = this.actor.getRollData();

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Rollable abilities
    html.find('.rollable').click(this._onRoll.bind(this));

    // Item controls
    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-edit').click(this._onItemEdit.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.rollType) {
      if (dataset.rollType === 'ability') {
        this.actor.rollAbilityCheck(dataset.ability);
      }
    }
  }

  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;

    const itemData = {
      name: `New ${type.capitalize()}`,
      type: type,
      system: {}
    };

    return await Item.create(itemData, { parent: this.actor });
  }

  _onItemEdit(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents('.item');
    const item = this.actor.items.get(li.data('itemId'));
    item.sheet.render(true);
  }

  async _onItemDelete(event) {
    event.preventDefault();
    const li = $(event.currentTarget).parents('.item');
    const item = this.actor.items.get(li.data('itemId'));

    if (item) {
      await item.delete();
      li.slideUp(200, () => this.render(false));
    }
  }

  _prepareEffects() {
    const effects = {
      temporary: [],
      passive: [],
      inactive: []
    };

    for (let e of this.actor.allApplicableEffects()) {
      if (e.disabled) effects.inactive.push(e);
      else if (e.isTemporary) effects.temporary.push(e);
      else effects.passive.push(e);
    }

    return effects;
  }
}
```

### Registering Sheets

```javascript
// module/your-system.mjs
import YourActorSheet from './sheets/actor-sheet.mjs';
import YourItemSheet from './sheets/item-sheet.mjs';

Hooks.once('init', function() {
  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('yoursystem', YourActorSheet, {
    types: ['character', 'npc'],
    makeDefault: true,
    label: 'YOURSYSTEM.SheetLabels.Actor'
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('yoursystem', YourItemSheet, {
    makeDefault: true,
    label: 'YOURSYSTEM.SheetLabels.Item'
  });
});
```

---

## Templates

### Handlebars Template Structure

```handlebars
{{!-- templates/actor/actor-character-sheet.hbs --}}
<form class="{{cssClass}} flexcol" autocomplete="off">
  {{!-- Sheet Header --}}
  <header class="sheet-header">
    <img class="profile-img" src="{{actor.img}}" data-edit="img" title="{{actor.name}}" height="100" width="100"/>
    <div class="header-fields">
      <h1 class="charname">
        <input name="name" type="text" value="{{actor.name}}" placeholder="Name"/>
      </h1>
      <div class="resources grid grid-3col">
        <div class="resource">
          <label for="system.health.value">Health</label>
          <input type="text" name="system.health.value" value="{{system.health.value}}" data-dtype="Number"/>
          <span> / </span>
          <input type="text" name="system.health.max" value="{{system.health.max}}" data-dtype="Number"/>
        </div>
      </div>
    </div>
  </header>

  {{!-- Sheet Tab Navigation --}}
  <nav class="sheet-tabs tabs" data-group="primary">
    <a class="item" data-tab="features">Features</a>
    <a class="item" data-tab="description">Description</a>
  </nav>

  {{!-- Sheet Body --}}
  <section class="sheet-body">
    {{!-- Features Tab --}}
    <div class="tab features" data-group="primary" data-tab="features">
      <ol class="items-list">
        <li class="item flexrow item-header">
          <div class="item-name">Name</div>
          <div class="item-controls">
            <a class="item-control item-create" title="Create item" data-type="item">
              <i class="fas fa-plus"></i> Add item
            </a>
          </div>
        </li>
        {{#each items as |item id|}}
          <li class="item flexrow" data-item-id="{{item._id}}">
            <div class="item-name">
              <div class="item-image">
                <a class="rollable" data-roll-type="item">
                  <img src="{{item.img}}" title="{{item.name}}" width="24" height="24"/>
                </a>
              </div>
              <h4>{{item.name}}</h4>
            </div>
            <div class="item-controls">
              <a class="item-control item-edit" title="Edit Item"><i class="fas fa-edit"></i></a>
              <a class="item-control item-delete" title="Delete Item"><i class="fas fa-trash"></i></a>
            </div>
          </li>
        {{/each}}
      </ol>
    </div>

    {{!-- Biography Tab --}}
    <div class="tab description" data-group="primary" data-tab="description">
      {{editor system.biography target="system.biography" button=true owner=owner editable=editable}}
    </div>
  </section>
</form>
```

### Handlebars Helpers

```javascript
// module/helpers/templates.mjs
export function preloadHandlebarsTemplates() {
  return loadTemplates([
    'systems/yoursystem/templates/actor/parts/actor-features.hbs',
    'systems/yoursystem/templates/actor/parts/actor-items.hbs',
    'systems/yoursystem/templates/actor/parts/actor-effects.hbs',
    'systems/yoursystem/templates/item/parts/item-effects.hbs',
  ]);
}

// Register custom Handlebars helpers
Handlebars.registerHelper('concat', function() {
  let outStr = '';
  for (let arg in arguments) {
    if (typeof arguments[arg] != 'object') {
      outStr += arguments[arg];
    }
  }
  return outStr;
});

Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});
```

---

## Styling

### SCSS Structure

```scss
// src/scss/yoursystem.scss
@import 'utils/variables';
@import 'utils/mixins';

@import 'global';
@import 'components/forms';
@import 'components/resource';
@import 'components/items';
@import 'components/effects';

// Actor sheets
@import 'sheets/actor';

// Item sheets
@import 'sheets/item';
```

### CSS Grid Helpers

```scss
// src/scss/global.scss
.grid {
  display: grid;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}

.grid-2col {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3col {
  grid-template-columns: repeat(3, 1fr);
}

.flexrow {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.flexcol {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.flex-between {
  justify-content: space-between;
}
```

---

## Hooks and Events

### Common Hooks

```javascript
// module/your-system.mjs

// Initialize system
Hooks.once('init', async function() {
  console.log('Initializing Your System');

  // Register document classes
  CONFIG.Actor.documentClass = YourActor;
  CONFIG.Item.documentClass = YourItem;

  // Register sheet classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('yoursystem', YourActorSheet, { makeDefault: true });

  // Preload templates
  await preloadHandlebarsTemplates();
});

// Setup system
Hooks.once('setup', function() {
  // Configure system settings
});

// Ready
Hooks.once('ready', async function() {
  // Wait for game to be ready
  console.log('Your System Ready');
});

// Create Actor
Hooks.on('createActor', (actor, options, userId) => {
  console.log('Actor created:', actor.name);
});

// Render Chat Message
Hooks.on('renderChatMessage', (app, html, data) => {
  // Add custom chat message handling
  html.find('.rollable').click(event => {
    // Handle rollable elements in chat
  });
});

// Get Scene Control Buttons
Hooks.on('getSceneControlButtons', (controls) => {
  // Add custom scene controls
  controls.push({
    name: 'yoursystem',
    title: 'Your System Tools',
    icon: 'fas fa-dice-d20',
    layer: 'yoursystem',
    tools: []
  });
});
```

---

## Rolls and Dice

### Basic Roll

```javascript
async function simpleRoll() {
  const roll = await new Roll('1d20').evaluate();

  roll.toMessage({
    speaker: ChatMessage.getSpeaker(),
    flavor: 'Simple Roll'
  });

  return roll;
}
```

### Roll with Data

```javascript
async function abilityRoll(actor, abilityId) {
  const rollData = actor.getRollData();
  const ability = actor.system.abilities[abilityId];

  const roll = await new Roll('1d20 + @mod', {
    mod: ability.mod
  }).evaluate();

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `${abilityId.toUpperCase()} Check`,
    rollMode: game.settings.get('core', 'rollMode')
  });

  return roll;
}
```

### Damage Roll

```javascript
async function damageRoll(item) {
  const rollData = item.getRollData();
  const formula = item.system.damage || '1d6';

  const roll = await new Roll(formula, rollData).evaluate();

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: item.actor }),
    flavor: `${item.name} - Damage`,
    rollMode: game.settings.get('core', 'rollMode')
  });

  return roll;
}
```

### Custom Roll Dialog

```javascript
async function rollWithDialog(actor, abilityId) {
  const ability = actor.system.abilities[abilityId];

  // Create dialog
  const html = await renderTemplate('systems/yoursystem/templates/dialog/roll-dialog.hbs', {
    ability: ability,
    abilityId: abilityId
  });

  return new Promise(resolve => {
    new Dialog({
      title: `${abilityId.toUpperCase()} Roll`,
      content: html,
      buttons: {
        normal: {
          label: 'Roll',
          callback: html => {
            const form = html[0].querySelector('form');
            const bonus = parseInt(form.bonus.value) || 0;

            const roll = new Roll('1d20 + @mod + @bonus', {
              mod: ability.mod,
              bonus: bonus
            }).evaluate();

            roll.toMessage({
              speaker: ChatMessage.getSpeaker({ actor }),
              flavor: `${abilityId.toUpperCase()} Check`
            });

            resolve(roll);
          }
        },
        cancel: {
          label: 'Cancel',
          callback: () => resolve(null)
        }
      },
      default: 'normal'
    }).render(true);
  });
}
```

---

## Active Effects

### Creating Effects

```javascript
async function createEffect(actor) {
  const effectData = {
    name: 'Blessed',
    icon: 'icons/magic/light/beam-rays-blue.webp',
    origin: actor.uuid,
    duration: {
      rounds: 10
    },
    changes: [
      {
        key: 'system.abilities.str.mod',
        mode: CONST.ACTIVE_EFFECT_MODES.ADD,
        value: '2'
      }
    ]
  };

  return await actor.createEmbeddedDocuments('ActiveEffect', [effectData]);
}
```

### Effect Modes

```javascript
// Available effect modes:
CONST.ACTIVE_EFFECT_MODES.CUSTOM      // 0 - Custom handling
CONST.ACTIVE_EFFECT_MODES.MULTIPLY    // 1 - Multiply base value
CONST.ACTIVE_EFFECT_MODES.ADD         // 2 - Add to base value
CONST.ACTIVE_EFFECT_MODES.DOWNGRADE   // 3 - Choose lowest value
CONST.ACTIVE_EFFECT_MODES.UPGRADE     // 4 - Choose highest value
CONST.ACTIVE_EFFECT_MODES.OVERRIDE    // 5 - Replace value
```

### Handling Custom Effects

```javascript
// In your Actor class
applyActiveEffects() {
  // Apply all non-disabled effects
  const overrides = {};

  // Organize effects
  const changes = this.effects.reduce((changes, e) => {
    if (e.disabled) return changes;
    return changes.concat(e.changes.map(c => {
      c = foundry.utils.deepClone(c);
      c.effect = e;
      c.priority = c.priority ?? (c.mode * 10);
      return c;
    }));
  }, []);
  changes.sort((a, b) => a.priority - b.priority);

  // Apply changes
  for (let change of changes) {
    const result = change.effect.apply(this, change);
    if (result !== null) overrides[change.key] = result;
  }

  // Expand object
  this.overrides = foundry.utils.expandObject(overrides);
}
```

---

## Best Practices

### Performance

1. **Avoid Unnecessary Re-renders**
   - Use `this.render(false)` when data hasn't changed structurally
   - Cache frequently accessed data

2. **Lazy Load Templates**
   - Only load templates when needed
   - Use `preloadHandlebarsTemplates()` for common templates

3. **Efficient Data Preparation**
   - Do calculations in `prepareDerivedData()`
   - Avoid recalculating in `getData()`

### Code Organization

1. **Modular Structure**
   - Separate concerns (documents, sheets, helpers)
   - Use ES6 modules (`import`/`export`)

2. **Configuration Object**
   ```javascript
   CONFIG.YOURSYSTEM = {
     abilities: {
       str: 'Strength',
       dex: 'Dexterity'
     },
     damageTypes: {
       physical: 'Physical',
       magical: 'Magical'
     }
   };
   ```

3. **Namespace Your Code**
   - Use a unique namespace to avoid conflicts
   - Store game-level data in `game.yoursystem`

### Localization

```json
// lang/en.json
{
  "YOURSYSTEM.AbilityStr": "Strength",
  "YOURSYSTEM.AbilityDex": "Dexterity",
  "YOURSYSTEM.Roll": "Roll",
  "YOURSYSTEM.Damage": "Damage"
}
```

```javascript
// In code
game.i18n.localize('YOURSYSTEM.AbilityStr');

// In templates
{{localize "YOURSYSTEM.AbilityStr"}}
```

### Error Handling

```javascript
try {
  const roll = await new Roll(formula).evaluate();
  roll.toMessage();
} catch (error) {
  console.error('Roll failed:', error);
  ui.notifications.error('Roll failed. Check the formula.');
}
```

### Settings

```javascript
Hooks.once('init', function() {
  game.settings.register('yoursystem', 'mySettingKey', {
    name: 'SETTINGS.MySettingName',
    hint: 'SETTINGS.MySettingHint',
    scope: 'world',      // 'world' or 'client'
    config: true,        // Show in module settings
    type: Boolean,
    default: false,
    onChange: value => {
      console.log('Setting changed:', value);
    }
  });
});

// Access setting
const value = game.settings.get('yoursystem', 'mySettingKey');
```

---

## Debugging

### Console Logging

```javascript
// Development logging
if (game.settings.get('yoursystem', 'debugMode')) {
  console.log('Debug:', data);
}
```

### Foundry DevMode Module

Install the _dev Mode_ module for enhanced debugging:
- Hook monitoring
- Performance profiling
- Better error messages

### Common Issues

1. **Sheet not rendering**
   - Check `get template()` path
   - Verify template file exists
   - Check for template syntax errors

2. **Data not saving**
   - Use `this.actor.update()` not direct assignment
   - Check data-dtype attributes in HTML

3. **Rolls not working**
   - Verify roll formula syntax
   - Check rollData is properly populated
   - Ensure roll is evaluated before message

---

## Resources

- [Official Foundry VTT Documentation](https://foundryvtt.com/kb/)
- [API Documentation](https://foundryvtt.com/api/)
- [Community Wiki](https://foundryvtt.wiki/)
- [System Development Tutorial](https://foundryvtt.wiki/en/development/guides/SD-tutorial)
- [Discord Community](https://discord.gg/foundryvtt)

---

## Version Compatibility

This guide targets **Foundry VTT v11-v12**. Some APIs may change in future versions. Always check the official documentation for your target version.
