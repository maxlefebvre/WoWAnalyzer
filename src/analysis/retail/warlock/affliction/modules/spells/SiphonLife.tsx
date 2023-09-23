import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import TALENTS from 'common/TALENTS/warlock';
import { SpellLink } from 'interface';
import Analyzer, { Options } from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';

const BAR_COLOR = '#306b1c';

class SiphonLifeUptime extends Analyzer {
  static dependencies = {
    enemies: Enemies,
  };
  protected enemies!: Enemies;

  get uptime() {
    return this.enemies.getBuffUptime(TALENTS.SIPHON_LIFE_TALENT.id) / this.owner.fightDuration;
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

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(TALENTS.SIPHON_LIFE_TALENT);
  }

  suggestions(when: When) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Your <SpellLink spell={TALENTS.SIPHON_LIFE_TALENT} /> uptime can be improved. Try to pay
          more attention to your Siphon Life on the boss, perhaps use some debuff tracker.
        </>,
      )
        .icon(TALENTS.SIPHON_LIFE_TALENT.icon)
        .actual(
          defineMessage({
            id: 'warlock.affliction.suggestions.siphonLife.uptime',
            message: `${formatPercentage(actual)}% Siphon Life uptime`,
          }),
        )
        .recommended(`>${formatPercentage(recommended)}% is recommended`),
    );
  }

  subStatistic() {
    const history = this.enemies.getDebuffHistory(TALENTS.SIPHON_LIFE_TALENT.id);
    return uptimeBarSubStatistic(this.owner.fight, {
      spells: [TALENTS.SIPHON_LIFE_TALENT],
      uptimes: history,
      color: BAR_COLOR,
    });
  }
}

export default SiphonLifeUptime;
