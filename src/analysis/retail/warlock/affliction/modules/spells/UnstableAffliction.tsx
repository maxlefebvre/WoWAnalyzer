import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import { QualitativePerformance } from 'parser/ui/QualitativePerformance';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';

const BAR_COLOR = '#d44b11';

class UnstableAfflictionUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };
  protected enemies!: Enemies;

  get uptime() {
    return this.enemies.getBuffUptime(SPELLS.UNSTABLE_AFFLICTION.id) / this.owner.fightDuration;
  }

  get suggestionThresholds() {
    return {
      actual: this.uptime,
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
          Your <SpellLink spell={SPELLS.UNSTABLE_AFFLICTION} /> uptime can be improved. Try to pay
          more attention to your Unstable Affliction on the boss, perhaps use some debuff tracker.
        </>,
      )
        .icon(SPELLS.UNSTABLE_AFFLICTION.icon)
        .actual(
          defineMessage({
            id: 'warlock.affliction.suggestions.unstableAffliction.uptime',
            message: `${formatPercentage(actual)}% Unstable Affliction uptime.`,
          }),
        )
        .recommended(`> ${formatPercentage(recommended)}% is recommended`),
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
    const history = this.enemies.getDebuffHistory(SPELLS.UNSTABLE_AFFLICTION.id);
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [SPELLS.UNSTABLE_AFFLICTION],
      perf: this.DowntimePerformance,
      uptimes: history,
      color: BAR_COLOR,
    });
  }
}

export default UnstableAfflictionUptime;
