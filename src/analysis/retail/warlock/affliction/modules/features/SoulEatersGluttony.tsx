import SPELLS from 'common/SPELLS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { DamageEvent } from 'parser/core/Events';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import TALENTS from 'common/TALENTS/warlock';
import Statistic from 'parser/ui/Statistic';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import { formatNumber } from 'common/format';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';
import { SpellLink } from 'interface';

/**
 * Soul-eaters Gluttony
 * Reduces the cooldown of  Soul Rot whenever your  Unstable Affliction deals damage.
 * You can only have Unstable Affliction on one target, the damage reduction is capped to how much haste you have. */

export const SOUL_EATER_GLUTTONY_CDR_PER_RANK = 500;

class SoulEatersGluttony extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
  };
  protected spellUsable!: SpellUsable;
  private totalCdr = 0;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(TALENTS.SOUL_EATERS_GLUTTONY_TALENT);
    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.UNSTABLE_AFFLICTION),
      this.onDamage,
    );
  }

  onDamage(_event: DamageEvent) {
    const amount =
      SOUL_EATER_GLUTTONY_CDR_PER_RANK *
      this.selectedCombatant.getTalentRank(TALENTS.SOUL_EATERS_GLUTTONY_TALENT);

    if (this.spellUsable.isOnCooldown(TALENTS.SOUL_ROT_TALENT.id)) {
      this.totalCdr += amount;
      this.spellUsable.reduceCooldown(TALENTS.SOUL_ROT_TALENT.id, amount);
    }
  }

  statistic() {
    return (
      <Statistic position={STATISTIC_ORDER.OPTIONAL()} size="flexible">
        <BoringSpellValueText spell={TALENTS.SOUL_EATERS_GLUTTONY_TALENT}>
          {formatNumber(this.totalCdr / 1000)}s of total{' '}
          <SpellLink spell={TALENTS.SOUL_ROT_TALENT} /> CDR
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default SoulEatersGluttony;
