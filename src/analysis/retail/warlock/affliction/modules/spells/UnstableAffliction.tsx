import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import DebuffUptime from 'parser/shared/modules/DebuffUptime';
import Enemies from 'parser/shared/modules/Enemies';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';
import { SPELL_COLORS } from '../../constants';

class UnstableAfflictionUptime extends DebuffUptime {
  debuffSpell = SPELLS.UNSTABLE_AFFLICTION;
  debuffColor = SPELL_COLORS.UNSTABLE_AFFLICTION;

  protected enemies!: Enemies;

  get suggestionThresholds() {
    return {
      actual: this.debuffUptime,
      isLessThan: {
        minor: 0.98,
        average: 0.95,
        major: 0.9,
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

  subStatistic() {
    const history = this.enemies.getDebuffHistory(SPELLS.UNSTABLE_AFFLICTION.id);
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [SPELLS.UNSTABLE_AFFLICTION],
      perf: this.DowntimePerformance,
      uptimes: history,
      color: this.debuffColor,
    });
  }
}

export default UnstableAfflictionUptime;
