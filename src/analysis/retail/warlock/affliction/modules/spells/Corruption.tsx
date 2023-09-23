import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import Analyzer from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';

const BAR_COLOR = '#a31010';

class CorruptionUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };
  protected enemies!: Enemies;

  get uptime() {
    return this.enemies.getBuffUptime(SPELLS.CORRUPTION_DEBUFF.id) / this.owner.fightDuration;
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
          Your <SpellLink spell={SPELLS.CORRUPTION_CAST} /> uptime can be improved. Try to pay more
          attention to your Corruption on the boss, perhaps use some debuff tracker.
        </>,
      )
        .icon(SPELLS.CORRUPTION_CAST.icon)
        .actual(
          defineMessage({
            id: 'warlock.affliction.suggestions.corruption.uptime',
            message: `${formatPercentage(actual)}% Corruption uptime`,
          }),
        )
        .recommended(`>${formatPercentage(recommended)}% is recommended`),
    );
  }
  subStatistic() {
    const history = this.enemies.getDebuffHistory(SPELLS.CORRUPTION_DEBUFF.id);
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [SPELLS.CORRUPTION_DEBUFF],
      uptimes: history,
      color: BAR_COLOR,
    });
  }
}

export default CorruptionUptime;
