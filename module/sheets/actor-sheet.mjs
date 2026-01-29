import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with FASERIP-specific functionality
 * @extends {ActorSheet}
 */
export class FASERIPActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['faserip', 'sheet', 'actor'],
      width: 720,
      height: 680,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'abilities',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/faserip/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.FASERIP
    context.config = CONFIG.FASERIP;

    // Prepare character data and items based on type
    this._prepareItems(context);

    switch (actorData.type) {
      case 'hero':
      case 'villain':
        this._prepareHeroData(context);
        break;
      case 'entity':
        this._prepareEntityData(context);
        break;
      case 'animal':
        this._prepareAnimalData(context);
        break;
      case 'alien':
        this._prepareAlienData(context);
        break;
      case 'supportingCast':
        this._prepareSupportingCastData(context);
        break;
    }

    // Enrich biography info for display
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        secrets: this.document.isOwner,
        async: true,
        rollData: this.actor.getRollData(),
        relativeTo: this.actor,
      }
    );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Prepare Hero/Villain specific context data
   * @param {object} context
   */
  _prepareHeroData(context) {
    // Add origin options
    context.origins = CONFIG.FASERIP.origins;

    // Add rank options for dropdowns
    context.ranks = CONFIG.FASERIP.ranks;
  }

  /**
   * Prepare Entity specific context data
   * @param {object} context
   */
  _prepareEntityData(context) {
    context.ranks = CONFIG.FASERIP.ranks;
  }

  /**
   * Prepare Animal specific context data
   * @param {object} context
   */
  _prepareAnimalData(context) {
    context.ranks = CONFIG.FASERIP.ranks;
  }

  /**
   * Prepare Alien specific context data
   * @param {object} context
   */
  _prepareAlienData(context) {
    context.origins = CONFIG.FASERIP.origins;
    context.ranks = CONFIG.FASERIP.ranks;
  }

  /**
   * Prepare Supporting Cast specific context data
   * @param {object} context
   */
  _prepareSupportingCastData(context) {
    context.ranks = CONFIG.FASERIP.ranks;
  }

  /**
   * Organize and classify Items for Actor sheets.
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers
    const powers = [];
    const talents = [];
    const equipment = [];
    const contacts = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;

      switch (i.type) {
        case 'power':
          powers.push(i);
          break;
        case 'talent':
          talents.push(i);
          break;
        case 'equipment':
          equipment.push(i);
          break;
        case 'contact':
          contacts.push(i);
          break;
      }
    }

    // Sort items by name
    powers.sort((a, b) => a.name.localeCompare(b.name));
    talents.sort((a, b) => a.name.localeCompare(b.name));
    equipment.sort((a, b) => a.name.localeCompare(b.name));
    contacts.sort((a, b) => a.name.localeCompare(b.name));

    // Assign to context
    context.powers = powers;
    context.talents = talents;
    context.equipment = equipment;
    context.contacts = contacts;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Ability value changes - update rank automatically
    html.on('change', '.ability-value', this._onAbilityChange.bind(this));

    // Value adjust buttons (+/-)
    html.on('click', '.adjust-btn', this._onAdjustValue.bind(this));

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = duplicate(header.dataset);
    const name = `New ${type.capitalize()}`;
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    delete itemData.system['type'];

    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle ability value changes to auto-update rank
   * @param {Event} event
   * @private
   */
  async _onAbilityChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const abilityKey = element.dataset.ability;
    const newValue = parseInt(element.value, 10) || 0;

    // The rank will be calculated automatically in prepareDerivedData
    await this.actor.update({
      [`system.abilities.${abilityKey}.value`]: newValue
    });
  }

  /**
   * Handle +/- button clicks to adjust values
   * @param {Event} event
   * @private
   */
  async _onAdjustValue(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const field = button.dataset.field;
    const delta = parseInt(button.dataset.delta, 10) || 0;

    // Get current value using foundry's getProperty
    const currentValue = foundry.utils.getProperty(this.actor, field) || 0;
    const newValue = Math.max(0, currentValue + delta);

    await this.actor.update({ [field]: newValue });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle ability rolls
    if (dataset.rollType === 'ability') {
      const abilityKey = dataset.ability;
      if (abilityKey) {
        return this.actor.rollAbility(abilityKey);
      }
    }

    // Handle item rolls
    if (dataset.rollType === 'item') {
      const itemId = element.closest('.item').dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) return item.roll();
    }

    // Handle rolls that supply the formula directly
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      await roll.evaluate();
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }
}
