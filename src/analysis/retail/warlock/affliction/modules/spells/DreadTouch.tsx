import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/warlock';
import { SpellLink } from 'interface';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import UptimeIcon from 'interface/icons/Uptime';
import { OpenTimePeriod, mergeTimePeriods } from 'parser/core/mergeTimePeriods';
import { TrackedBuffEvent } from 'parser/core/Entity';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';
import DebuffUptime from 'parser/shared/modules/DebuffUptime';
import { SPELL_COLORS } from '../../constants';

export default class DreadTouch extends DebuffUptime {
  debuffSpell = SPELLS.DREAD_TOUCH_DEBUFF;
  debuffColor = SPELL_COLORS.DREAD_TOUCH;

  protected enemies!: Enemies;

  private get debuffUptimePeriods(): OpenTimePeriod[] {
    const events: OpenTimePeriod[] = [];
    const entities = this.enemies.getEntities();
    Object.values(entities).forEach((enemy) => {
      enemy
        .getBuffHistory(SPELLS.DREAD_TOUCH_DEBUFF.id, this.selectedCombatant.id)
        .forEach((buff: TrackedBuffEvent) => {
          events.push({
            start: buff.start,
            end: buff.end ?? this.owner.fight.end_time,
          });
        });
    });
    return events;
  }

  get suggestionThresholds() {
    return {
      actual: this.debuffUptime,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: 0.8,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  suggestions(when: When) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          You should maintain <SpellLink spell={SPELLS.DREAD_TOUCH_DEBUFF} /> as much as possible.
        </>,
      )
        .icon(SPELLS.DREAD_TOUCH_DEBUFF.icon)
        .actual(`${formatPercentage(actual)}% ${SPELLS.DREAD_TOUCH_DEBUFF.name} uptime`)
        .recommended(`at least ${formatPercentage(recommended)}% is recommended`),
    );
  }

  statistic() {
    return (
      <Statistic
        category={STATISTIC_CATEGORY.TALENTS}
        size="flexible"
        tooltip={
          <>
            {formatPercentage(this.debuffUptime)} uptime
            <br />
          </>
        }
      >
        <BoringSpellValueText spell={TALENTS.DREAD_TOUCH_TALENT}>
          <UptimeIcon /> {formatPercentage(this.debuffUptime)} % <small>uptime</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }

  subStatistic() {
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [TALENTS.DREAD_TOUCH_TALENT],
      perf: this.DowntimePerformance,
      uptimes: mergeTimePeriods(this.debuffUptimePeriods, this.owner.currentTimestamp),
      color: this.debuffColor,
    });
  }
}
