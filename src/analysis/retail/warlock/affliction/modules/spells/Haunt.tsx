import { defineMessage } from '@lingui/macro';
import { formatPercentage, formatThousands, formatNumber } from 'common/format';
import TALENTS from 'common/TALENTS/warlock';
import { SpellLink } from 'interface';
import { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import { calculateEffectiveDamage } from 'parser/core/EventCalculateLib';
import Events, { DamageEvent } from 'parser/core/Events';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import DebuffUptime from 'parser/shared/modules/DebuffUptime';
import Enemies from 'parser/shared/modules/Enemies';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';
import { SPELL_COLORS } from '../../constants';

const HAUNT_DAMAGE_BONUS = 0.1;

class Haunt extends DebuffUptime {
  debuffSpell = TALENTS.HAUNT_TALENT;
  debuffColor = SPELL_COLORS.HAUNT;

  protected enemies!: Enemies;

  get dps() {
    return (this.bonusDmg / this.owner.fightDuration) * 1000;
  }

  get suggestionThresholds() {
    return {
      actual: this.debuffUptime,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: 0.85,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  bonusDmg = 0;
  totalTicks = 0;
  buffedTicks = 0;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(TALENTS.HAUNT_TALENT);
    this.addEventListener(Events.damage.by(SELECTED_PLAYER), this.onDamage);
  }

  onDamage(event: DamageEvent) {
    const target = this.enemies.getEntity(event);
    if (!target) {
      return;
    }

    const hasHaunt = target.hasBuff(TALENTS.HAUNT_TALENT.id, event.timestamp);

    if (hasHaunt) {
      this.bonusDmg += calculateEffectiveDamage(event, HAUNT_DAMAGE_BONUS);
    }
  }

  suggestions(when: When) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Your <SpellLink spell={TALENTS.HAUNT_TALENT} /> debuff uptime is too low. While it's
          usually not possible to get 100% uptime due to travel and cast time, you should aim for as
          much uptime on the debuff as possible.
        </>,
      )
        .icon(TALENTS.HAUNT_TALENT.icon)
        .actual(
          defineMessage({
            id: 'warlock.affliction.suggestions.haunt.uptime',
            message: `${formatPercentage(actual)}% Haunt uptime.`,
          }),
        )
        .recommended(`> ${formatPercentage(recommended)}% is recommended`),
    );
  }

  statistic() {
    return (
      <Statistic
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        tooltip={
          <>
            {formatThousands(this.bonusDmg)} bonus damage
            <br />
          </>
        }
      >
        <BoringSpellValueText spell={TALENTS.HAUNT_TALENT}>
          {formatPercentage(this.debuffUptime)} % <small>uptime</small>
          <br />
          {formatNumber(this.dps)} DPS{' '}
          <small>
            {formatPercentage(this.owner.getPercentageOfTotalDamageDone(this.bonusDmg))} % of total
          </small>
        </BoringSpellValueText>
      </Statistic>
    );
  }

  subStatistic() {
    const history = this.enemies.getDebuffHistory(TALENTS.HAUNT_TALENT.id);
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [TALENTS.HAUNT_TALENT],
      perf: this.DowntimePerformance,
      uptimes: history,
      color: this.debuffColor,
    });
  }
}

export default Haunt;
