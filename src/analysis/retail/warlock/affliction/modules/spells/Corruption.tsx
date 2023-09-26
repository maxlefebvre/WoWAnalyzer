import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import DebuffUptime from 'parser/shared/modules/DebuffUptime';
import Enemies from 'parser/shared/modules/Enemies';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';
import { SPELL_COLORS } from '../../constants';

class CorruptionUptime extends DebuffUptime {
  debuffSpell = SPELLS.CORRUPTION_DEBUFF;
  debuffColor = SPELL_COLORS.CORRUPTION;

  protected enemies!: Enemies;

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
      perf: this.DowntimePerformance,
      uptimes: history,
      color: this.debuffColor,
    });
  }
}

export default CorruptionUptime;
