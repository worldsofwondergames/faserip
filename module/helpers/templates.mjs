/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor sheet templates
    'systems/faserip/templates/actor/actor-hero-sheet.hbs',
    'systems/faserip/templates/actor/actor-villain-sheet.hbs',
    'systems/faserip/templates/actor/actor-entity-sheet.hbs',
    'systems/faserip/templates/actor/actor-animal-sheet.hbs',
    'systems/faserip/templates/actor/actor-alien-sheet.hbs',
    'systems/faserip/templates/actor/actor-supportingCast-sheet.hbs',
    // Actor partials
    'systems/faserip/templates/actor/parts/actor-effects.hbs',
    // Item sheet templates
    'systems/faserip/templates/item/item-power-sheet.hbs',
    'systems/faserip/templates/item/item-talent-sheet.hbs',
    'systems/faserip/templates/item/item-equipment-sheet.hbs',
    'systems/faserip/templates/item/item-contact-sheet.hbs',
    // Item partials
    'systems/faserip/templates/item/parts/item-effects.hbs',
    // Dialog templates
    'systems/faserip/templates/dialog/feat-roll-dialog.hbs',
    // Chat templates
    'systems/faserip/templates/chat/feat-roll-result.hbs',
  ]);
};
