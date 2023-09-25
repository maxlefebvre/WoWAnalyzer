import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/warlock';
import { SpellLink } from 'interface';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import DebuffUptime from 'parser/shared/modules/DebuffUptime';
import Enemies from 'parser/shared/modules/Enemies';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';
import { SPELL_COLORS } from '../../constants';

class AgonyUptime extends DebuffUptime {
  debuffSpell = SPELLS.AGONY;
  debuffColor = SPELL_COLORS.AGONY;

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
    const text = this.selectedCombatant.hasTalent(TALENTS.WRITHE_IN_AGONY_TALENT) ? (
      <>
        Your <SpellLink spell={SPELLS.AGONY} /> uptime can be improved as it is your main source of
        Soul Shards. Try to pay more attention to your Agony on the boss, especially since you're
        using <SpellLink spell={TALENTS.WRITHE_IN_AGONY_TALENT} /> talent.
      </>
    ) : (
      <>
        Your <SpellLink spell={SPELLS.AGONY} /> uptime can be improved as it is your main source of
        Soul Shards. Try to pay more attention to your Agony on the boss, perhaps use some debuff
        tracker.
      </>
    );
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(text)
        .icon(SPELLS.AGONY.icon)
        .actual(
          defineMessage({
            id: 'warlock.affliction.suggestions.agony.uptime',
            message: `${formatPercentage(actual)}% Agony uptime`,
          }),
        )
        .recommended(`> ${formatPercentage(recommended)}% is recommended`),
    );
  }

  subStatistic() {
    const history = this.enemies.getDebuffHistory(SPELLS.AGONY.id);
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [SPELLS.AGONY],
      perf: this.DowntimePerformance,
      uptimes: history,
      color: this.debuffColor,
    });
  }
}

export default AgonyUptime;
