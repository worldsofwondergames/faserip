import { calculateHealth, calculateKarma, valueToRankKey, valueToRankAbbr } from '../helpers/faserip-utils.mjs';
import { getFeatResult, getResultDisplay, UNIVERSAL_TABLE, normalizeRankKey, applyColumnShiftWithLimits, getRequiredColor, meetsColorRequirement, getActionResult } from '../helpers/universal-table.mjs';

/**
 * Extend the base Actor document for the FASERIP system.
 * @extends {Actor}
 */
export class FASERIPActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data.
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.faserip || {};

    // Prepare data based on actor type
    switch (actorData.type) {
      case 'hero':
      case 'villain':
      case 'entity':
      case 'alien':
        this._prepareFullCharacterData(actorData);
        break;
      case 'animal':
        this._prepareAnimalData(actorData);
        break;
      case 'supportingCast':
        this._prepareSupportingCastData(actorData);
        break;
    }
  }

  /**
   * Prepare data for full character types (Hero, Villain, Entity, Alien)
   * @param {object} actorData
   */
  _prepareFullCharacterData(actorData) {
    const systemData = actorData.system;

    // Calculate rank information and FEAT thresholds for each ability
    if (systemData.abilities) {
      for (let [key, ability] of Object.entries(systemData.abilities)) {
        ability.rank = valueToRankKey(ability.value);
        ability.abbr = valueToRankAbbr(ability.value);

        // Get FEAT thresholds from universal table
        const normalizedRank = normalizeRankKey(ability.rank);
        const thresholds = UNIVERSAL_TABLE[normalizedRank] || UNIVERSAL_TABLE.typical;
        ability.feat = {
          green: thresholds.green,
          yellow: thresholds.yellow,
          red: thresholds.red
        };
      }
    }

    // Calculate Health (F + A + S + E)
    if (systemData.health) {
      systemData.health.max = calculateHealth(systemData.abilities);
      // Don't override current value if it exists
      if (systemData.health.value === undefined || systemData.health.value === null) {
        systemData.health.value = systemData.health.max;
      }
    }

    // Calculate Karma max (R + I + P)
    if (systemData.karma) {
      systemData.karma.max = calculateKarma(systemData.abilities);
      // Don't override current value if it exists
      if (systemData.karma.value === undefined || systemData.karma.value === null) {
        systemData.karma.value = systemData.karma.max;
      }
    }

    // Calculate Resources rank
    if (systemData.resources) {
      systemData.resources.rank = valueToRankKey(systemData.resources.value);
      systemData.resources.abbr = valueToRankAbbr(systemData.resources.value);
    }
  }

  /**
   * Prepare data for Animal actors
   * @param {object} actorData
   */
  _prepareAnimalData(actorData) {
    const systemData = actorData.system;

    // Calculate rank information and FEAT thresholds for each ability
    if (systemData.abilities) {
      for (let [key, ability] of Object.entries(systemData.abilities)) {
        ability.rank = valueToRankKey(ability.value);
        ability.abbr = valueToRankAbbr(ability.value);

        // Get FEAT thresholds from universal table
        const normalizedRank = normalizeRankKey(ability.rank);
        const thresholds = UNIVERSAL_TABLE[normalizedRank] || UNIVERSAL_TABLE.typical;
        ability.feat = {
          green: thresholds.green,
          yellow: thresholds.yellow,
          red: thresholds.red
        };
      }
    }

    // Calculate Health (F + A + S + E)
    if (systemData.health) {
      systemData.health.max = calculateHealth(systemData.abilities);
      if (systemData.health.value === undefined || systemData.health.value === null) {
        systemData.health.value = systemData.health.max;
      }
    }
  }

  /**
   * Prepare data for Supporting Cast actors
   * @param {object} actorData
   */
  _prepareSupportingCastData(actorData) {
    const systemData = actorData.system;

    // Calculate rank information and FEAT thresholds for each ability
    if (systemData.abilities) {
      for (let [key, ability] of Object.entries(systemData.abilities)) {
        ability.rank = valueToRankKey(ability.value);
        ability.abbr = valueToRankAbbr(ability.value);

        // Get FEAT thresholds from universal table
        const normalizedRank = normalizeRankKey(ability.rank);
        const thresholds = UNIVERSAL_TABLE[normalizedRank] || UNIVERSAL_TABLE.typical;
        ability.feat = {
          green: thresholds.green,
          yellow: thresholds.yellow,
          red: thresholds.red
        };
      }
    }

    // Calculate Health (F + A + S + E)
    if (systemData.health) {
      systemData.health.max = calculateHealth(systemData.abilities);
      if (systemData.health.value === undefined || systemData.health.value === null) {
        systemData.health.value = systemData.health.max;
      }
    }
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = { ...this.system };

    // Copy abilities to top level for easy access in formulas
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add initiative modifier based on Intuition
    if (data.abilities?.intuition) {
      data.initiative = data.abilities.intuition.value;
    }

    return data;
  }

  /**
   * Roll a FEAT check for an ability
   * @param {string} abilityKey - The ability to roll (fighting, agility, etc.)
   * @param {object} options - Additional options for the roll
   * @param {string} options.actionType - The action type (e.g., 'bluntAttacks', 'other')
   * @param {string|null} options.intensity - The intensity rank key, or null for no intensity check
   * @param {number} options.columnShift - Column shift modifier (-3 to +3)
   * @param {boolean} options._skipDialog - If true, skip the dialog
   * @returns {Promise<Roll>}
   */
  async rollAbility(abilityKey, options = {}) {
    const ability = this.system.abilities?.[abilityKey];
    if (!ability) {
      ui.notifications.warn(`Ability ${abilityKey} not found on actor ${this.name}`);
      return null;
    }

    // If no actionType provided and dialog not skipped, show the dialog
    if (options.actionType === undefined && !options._skipDialog) {
      const { FEATRollDialog } = await import('../applications/feat-roll-dialog.mjs');
      new FEATRollDialog(this, abilityKey).render(true);
      return null;
    }

    const rankKey = ability.rank || valueToRankKey(ability.value);
    const label = game.i18n.localize(`FASERIP.Ability.${abilityKey.charAt(0).toUpperCase() + abilityKey.slice(1)}.long`);

    // Apply column shifts to get effective rank
    const columnShift = options.columnShift || 0;
    const shiftResult = applyColumnShiftWithLimits(rankKey, columnShift);
    const effectiveRank = shiftResult.effectiveRank;
    const effectiveRankData = CONFIG.FASERIP.ranks[effectiveRank];

    // Determine required color if intensity is set
    const hasIntensity = options.intensity && options.intensity !== 'none';
    let requiredColor = 'green';
    let isSuccess = true;

    if (hasIntensity) {
      requiredColor = getRequiredColor(options.intensity, effectiveRank);
    }

    // Roll d100
    const roll = new Roll('1d100');
    await roll.evaluate();

    // Determine result color against effective rank
    const resultColor = getFeatResult(roll.total, effectiveRank);
    const resultDisplay = getResultDisplay(resultColor);

    // Check success if intensity is set
    if (hasIntensity) {
      isSuccess = meetsColorRequirement(resultColor, requiredColor);
    }

    // Get action-specific result text
    let actionResultText = null;
    let colorLabel = null;
    const actionType = options.actionType || 'other';

    if (actionType && actionType !== 'other') {
      const actionResult = getActionResult(actionType, resultColor);
      if (actionResult.localizedKey) {
        actionResultText = game.i18n.localize(actionResult.localizedKey);
      }
      // Get simple color label for action results
      colorLabel = game.i18n.localize(`FASERIP.Color.${resultColor.charAt(0).toUpperCase() + resultColor.slice(1)}`);
    }

    // Get intensity rank abbreviation
    let intensityAbbr = null;
    if (hasIntensity) {
      const intensityRankData = CONFIG.FASERIP.ranks[options.intensity];
      intensityAbbr = intensityRankData?.abbr || options.intensity;
    }

    // Get required color label
    const requiredColorLabel = game.i18n.localize(`FASERIP.Color.${requiredColor.charAt(0).toUpperCase() + requiredColor.slice(1)}`);

    // Render the roll HTML
    const rollHTML = await roll.render();

    // Determine if we should show additional details
    const showDetails = columnShift !== 0 || hasIntensity;

    // Render chat template
    const content = await renderTemplate('systems/faserip/templates/chat/feat-roll-result.hbs', {
      rollHTML,
      resultColor,
      resultLabel: game.i18n.localize(resultDisplay.label),
      resultCssClass: resultDisplay.cssClass,
      actionType,
      actionResultText,
      colorLabel,
      isSuccess,
      hasIntensity,
      requiredColor,
      requiredColorLabel,
      effectiveRankAbbr: effectiveRankData?.abbr || effectiveRank,
      intensity: options.intensity,
      intensityAbbr,
      columnShift,
      showDetails
    });

    // Create single chat message with roll and result
    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${label} FEAT (${ability.abbr} ${ability.value})`,
      content: content,
      rolls: [roll],
      sound: CONFIG.sounds.dice,
      rollMode: options.rollMode || game.settings.get('core', 'rollMode'),
    });

    return roll;
  }

  /**
   * Roll initiative for this actor
   * @param {object} options
   * @returns {Promise<Roll>}
   */
  async rollInitiative(options = {}) {
    const intuition = this.system.abilities?.intuition?.value || 0;
    const formula = `1d10 + ${intuition}`;

    const roll = new Roll(formula);
    await roll.evaluate();

    const messageData = {
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `Initiative (Intuition ${valueToRankAbbr(intuition)})`,
      rollMode: options.rollMode || game.settings.get('core', 'rollMode'),
    };

    await roll.toMessage(messageData);
    return roll;
  }
}
