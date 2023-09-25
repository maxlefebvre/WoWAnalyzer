import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/warlock';
import { SpellLink } from 'interface';
import Analyzer from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import UptimeIcon from 'interface/icons/Uptime';
import { OpenTimePeriod, mergeTimePeriods } from 'parser/core/mergeTimePeriods';
import { TrackedBuffEvent } from 'parser/core/Entity';
import { QualitativePerformance } from 'parser/ui/QualitativePerformance';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';

const BAR_COLOR = '#2d1336';

export default class DreadTouch extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };

  protected enemies!: Enemies;

  get uptime() {
    return this.enemies.getBuffUptime(SPELLS.DREAD_TOUCH_DEBUFF.id) / this.owner.fightDuration;
  }

  private get uptimePeriods(): OpenTimePeriod[] {
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
      actual: this.uptime,
      isLessThan: {
        minor: 0.2,
        average: 0.15,
        major: 0.1,
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
            {formatPercentage(this.uptime)} uptime
            <br />
          </>
        }
      >
        <BoringSpellValueText spell={TALENTS.DREAD_TOUCH_TALENT}>
          <UptimeIcon /> {formatPercentage(this.uptime)} % <small>uptime</small>
        </BoringSpellValueText>
      </Statistic>
    );
  }

  get DowntimePerformance(): QualitativePerformance {
    const downtime = 1 - this.uptime;
    if (downtime <= 0.01) {
      return QualitativePerformance.Perfect;
    }
    if (downtime <= 0.05) {
      return QualitativePerformance.Good;
    }
    if (downtime <= 0.1) {
      return QualitativePerformance.Ok;
    }
    return QualitativePerformance.Fail;
  }

  subStatistic() {
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [TALENTS.DREAD_TOUCH_TALENT],
      perf: this.DowntimePerformance,
      uptimes: mergeTimePeriods(this.uptimePeriods, this.owner.currentTimestamp),
      color: BAR_COLOR,
    });
  }
}
