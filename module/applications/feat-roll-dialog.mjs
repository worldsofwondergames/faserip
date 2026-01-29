import { applyColumnShiftWithLimits, getRequiredColor } from '../helpers/universal-table.mjs';

/**
 * Dialog for configuring FEAT roll options
 * @extends {Application}
 */
export class FEATRollDialog extends Application {
  constructor(actor, abilityKey, options = {}) {
    super(options);
    this.actor = actor;
    this.abilityKey = abilityKey;
    this.ability = actor.system.abilities[abilityKey];
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'feat-roll-dialog',
      classes: ['faserip', 'feat-dialog'],
      title: game.i18n.localize('FASERIP.Dialog.FEATRoll'),
      template: 'systems/faserip/templates/dialog/feat-roll-dialog.hbs',
      width: 320,
      height: 'auto',
      resizable: false
    });
  }

  getData() {
    const config = CONFIG.FASERIP;

    // Get actions for this ability
    const abilityActions = config.abilityActions?.[this.abilityKey] || [];
    const actionChoices = [];

    // Add "Other" option first
    actionChoices.push({
      key: 'other',
      label: game.i18n.localize('FASERIP.Action.Other')
    });

    // Add specific actions for this ability
    for (const actionKey of abilityActions) {
      const action = config.actionTypes[actionKey];
      if (action) {
        actionChoices.push({
          key: actionKey,
          label: game.i18n.localize(action.label)
        });
      }
    }

    // Get rank choices for intensity
    const intensityChoices = [];

    // Add "None" option for when no intensity check is needed
    intensityChoices.push({
      key: 'none',
      label: game.i18n.localize('FASERIP.Dialog.NoIntensity')
    });

    // Add all ranks
    for (const rankKey of config.rankOrder) {
      const rank = config.ranks[rankKey];
      intensityChoices.push({
        key: rankKey,
        label: game.i18n.localize(rank.label)
      });
    }

    // Column shift options (-3 to +3)
    const columnShiftOptions = [];
    for (let i = -3; i <= 3; i++) {
      columnShiftOptions.push({
        value: i,
        label: i > 0 ? `+${i}` : String(i),
        selected: i === 0
      });
    }

    // Get ability label
    const abilityLabel = game.i18n.localize(config.abilities[this.abilityKey]);

    return {
      actor: this.actor,
      abilityKey: this.abilityKey,
      abilityLabel,
      abilityRank: this.ability.abbr,
      abilityValue: this.ability.value,
      abilityRankKey: this.ability.rank,
      actionChoices,
      intensityChoices,
      columnShiftOptions
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find('.roll-feat').click(this._onRoll.bind(this));
    html.find('.cancel').click(() => this.close());

    // Update preview when options change
    html.find('select').change(this._updatePreview.bind(this));

    // Initialize preview
    this._updatePreview();
  }

  _updatePreview() {
    const form = this.element.find('form');
    const intensity = form.find('[name="intensity"]').val();
    const columnShift = parseInt(form.find('[name="columnShift"]').val()) || 0;

    // Calculate effective rank
    const result = applyColumnShiftWithLimits(this.ability.rank, columnShift);
    const effectiveRankData = CONFIG.FASERIP.ranks[result.effectiveRank];
    const effectiveRankDisplay = effectiveRankData?.abbr || result.effectiveRank;

    // Update effective rank display
    form.find('.effective-rank').text(effectiveRankDisplay);

    // Update required color display
    const requiredColorEl = form.find('.required-color');

    if (intensity === 'none') {
      requiredColorEl.text(game.i18n.localize('FASERIP.Color.Green') + '+');
      requiredColorEl.attr('class', 'required-color feat-green');
    } else {
      const requiredColor = getRequiredColor(intensity, result.effectiveRank);
      const colorLabel = game.i18n.localize(`FASERIP.Color.${requiredColor.charAt(0).toUpperCase() + requiredColor.slice(1)}`);
      requiredColorEl.text(colorLabel);
      requiredColorEl.attr('class', `required-color feat-${requiredColor}`);
    }

    // Show shift warning if limited
    const warningEl = form.find('.shift-warning');
    if (result.wasLimited && result.reason) {
      warningEl.text(game.i18n.localize(`FASERIP.Shift.${result.reason.charAt(0).toUpperCase() + result.reason.slice(1)}`));
      warningEl.show();
    } else {
      warningEl.hide();
    }
  }

  async _onRoll(event) {
    event.preventDefault();
    const form = this.element.find('form');

    const formData = {
      actionType: form.find('[name="actionType"]').val(),
      intensity: form.find('[name="intensity"]').val(),
      columnShift: parseInt(form.find('[name="columnShift"]').val()) || 0
    };

    // Convert 'none' intensity to null
    if (formData.intensity === 'none') {
      formData.intensity = null;
    }

    await this.actor.rollAbility(this.abilityKey, formData);
    this.close();
  }
}
