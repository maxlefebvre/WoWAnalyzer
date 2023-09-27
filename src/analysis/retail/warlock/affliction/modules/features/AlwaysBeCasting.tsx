import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import CoreAlwaysBeCasting from 'parser/shared/modules/AlwaysBeCasting';
import { STATISTIC_ORDER } from 'parser/ui/StatisticBox';
import { GlobalCooldownEvent } from 'parser/core/Events';
import getUptimeGraph, { UptimeHistoryEntry } from 'parser/shared/modules/getUptimeGraph';
import { QualitativePerformance } from 'parser/ui/QualitativePerformance';
import { SpellLink } from 'interface';
import SPELLS from 'common/SPELLS/warlock';
import TALENTS from 'common/TALENTS/warlock';
import Statistic from 'parser/ui/Statistic';
import Gauge from 'parser/ui/Gauge';

class AlwaysBeCasting extends CoreAlwaysBeCasting {
  position = STATISTIC_ORDER.CORE(6);

  uptimeHistory: UptimeHistoryEntry[] = [];

  onGCD(event: GlobalCooldownEvent) {
    const super_result = super.onGCD(event);

    this.uptimeHistory.push({
      timestamp: this.owner.currentTimestamp,
      uptimePct: this.activeTimePercentage,
    });

    return super_result;
  }

  get graphSubsection() {
    return getUptimeGraph(this.uptimeHistory, this.owner.fight.start_time);
  }

  get suggestionThresholds() {
    return {
      actual: this.downtimePercentage,
      isGreaterThan: {
        minor: 0.1,
        average: 0.15,
        major: 0.2,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  get DowntimePerformance(): QualitativePerformance {
    const downtime = this.downtimePercentage;
    if (downtime <= 0.1) {
      return QualitativePerformance.Perfect;
    }
    if (downtime <= 0.15) {
      return QualitativePerformance.Good;
    }
    if (downtime <= 0.2) {
      return QualitativePerformance.Ok;
    }
    return QualitativePerformance.Fail;
  }

  suggestions(when: When) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Your downtime can be improved. Try to Always Be Casting (ABC), try to reduce the delay
          between casting spells. Even if you have to move, try casting something instant - maybe
          refresh your dots. Make good use of your <SpellLink spell={SPELLS.DEMONIC_CIRCLE} /> or
          <SpellLink spell={TALENTS.BURNING_RUSH_TALENT} /> when you can.
        </>,
      )
        .icon('spell_mage_altertime')
        .actual(
          defineMessage({
            id: 'warlock.affliction.suggestions.alwaysBeCasting.downtime',
            message: `${formatPercentage(actual)}% downtime`,
          }),
        )
        .recommended(`<${formatPercentage(recommended)}% is recommended`)
        .regular(recommended + 0.15)
        .major(recommended + 0.2),
    );
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.CORE(10)}
        tooltip={
          <>
            Downtime is available time not used to cast anything (including not having your GCD
            rolling). This can be caused by delays between casting spells, latency, cast
            interrupting or just simply not casting anything (e.g. due to movement/stunned).
            <br />
            <ul>
              <li>
                You spent <strong>{formatPercentage(this.activeTimePercentage)}%</strong> of your
                time casting something.
              </li>
              <li>
                You spent <strong>{formatPercentage(this.downtimePercentage)}%</strong> of your time
                casting nothing at all.
              </li>
            </ul>
          </>
        }
      >
        <div className="pad">
          <label>Active time</label>
          <Gauge value={this.activeTimePercentage} />
        </div>
      </Statistic>
    );
  }
}

export default AlwaysBeCasting;
