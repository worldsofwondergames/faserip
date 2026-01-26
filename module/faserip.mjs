// Import document classes.
import { FASERIPActor } from './documents/actor.mjs';
import { FASERIPItem } from './documents/item.mjs';
// Import sheet classes.
import { FASERIPActorSheet } from './sheets/actor-sheet.mjs';
import { FASERIPItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { FASERIP } from './helpers/config.mjs';
import { valueToRankAbbr, valueToRankKey } from './helpers/faserip-utils.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.faserip = {
    FASERIPActor,
    FASERIPItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.FASERIP = FASERIP;

  /**
   * Set an initiative formula for the system
   * FASERIP uses 1d10 + Intuition rank value
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d10 + @abilities.intuition.value',
    decimals: 0,
  };

  // Define custom Document classes
  CONFIG.Actor.documentClass = FASERIPActor;
  CONFIG.Item.documentClass = FASERIPItem;

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('faserip', FASERIPActorSheet, {
    makeDefault: true,
    label: 'FASERIP.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('faserip', FASERIPItemSheet, {
    makeDefault: true,
    label: 'FASERIP.SheetLabels.Item',
  });

  // Register Handlebars helpers
  _registerHandlebarsHelpers();

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

function _registerHandlebarsHelpers() {
  // Convert string to lowercase
  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  // Convert a numeric value to its rank abbreviation
  Handlebars.registerHelper('rankAbbr', function (value) {
    return valueToRankAbbr(value);
  });

  // Convert a numeric value to its rank key
  Handlebars.registerHelper('rankKey', function (value) {
    return valueToRankKey(value);
  });

  // Format a value with its rank abbreviation
  Handlebars.registerHelper('formatRank', function (value) {
    const abbr = valueToRankAbbr(value);
    return `${abbr} (${value})`;
  });

  // Check if two values are equal
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });

  // Lookup a value in the FASERIP config
  Handlebars.registerHelper('lookup', function (obj, key) {
    return obj?.[key];
  });

  // Get localized rank name from rank key
  Handlebars.registerHelper('rankName', function (rankKey) {
    const rank = FASERIP.ranks[rankKey];
    if (rank) {
      return game.i18n.localize(rank.label);
    }
    return rankKey;
  });

  // Iterate over FASERIP abilities
  Handlebars.registerHelper('eachAbility', function (abilities, options) {
    let result = '';
    const abilityOrder = ['fighting', 'agility', 'strength', 'endurance', 'reason', 'intuition', 'psyche'];
    for (const key of abilityOrder) {
      if (abilities[key]) {
        result += options.fn({ key, ...abilities[key] });
      }
    }
    return result;
  });

  // Get CSS class for result color
  Handlebars.registerHelper('resultColorClass', function (color) {
    const classes = {
      white: 'feat-white',
      green: 'feat-green',
      yellow: 'feat-yellow',
      red: 'feat-red',
    };
    return classes[color] || 'feat-white';
  });

  // Check if array includes a value
  Handlebars.registerHelper('includes', function (array, value) {
    if (!Array.isArray(array)) return false;
    return array.includes(value);
  });

  // Concatenate strings
  Handlebars.registerHelper('concat', function (...args) {
    // Remove the Handlebars options object from the end
    args.pop();
    return args.join('');
  });

  // Capitalize first letter of each word
  Handlebars.registerHelper('capitalize', function (str) {
    if (typeof str !== 'string') return '';
    return str.replace(/\b\w/g, l => l.toUpperCase());
  });
}

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.faserip.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'faserip.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
