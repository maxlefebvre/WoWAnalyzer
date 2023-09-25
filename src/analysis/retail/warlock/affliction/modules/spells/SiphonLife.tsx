import { defineMessage } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import TALENTS from 'common/TALENTS/warlock';
import { SpellLink } from 'interface';
import { Options } from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import DebuffUptime from 'parser/shared/modules/DebuffUptime';
import Enemies from 'parser/shared/modules/Enemies';
import { QualitativePerformance } from 'parser/ui/QualitativePerformance';
import uptimeBarSubStatistic from 'parser/ui/UptimeBarSubStatistic';
import { SPELL_COLORS } from '../../constants';

class SiphonLifeUptime extends DebuffUptime {
  debuffSpell = TALENTS.SIPHON_LIFE_TALENT;
  debuffColor = SPELL_COLORS.SIPHON_LIFE;

  protected enemies!: Enemies;

  get uptime() {
    return this.enemies.getBuffUptime(TALENTS.SIPHON_LIFE_TALENT.id) / this.owner.fightDuration;
  }

  get suggestionThresholds() {
    return {
      actual: this.uptime,
      isLessThan: {
        minor: 0.98,
        average: 0.95,
        major: 0.9,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
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
      perf: this.DowntimePerformance,
      uptimes: history,
      color: this.debuffColor,
    });
  }
}

export default SiphonLifeUptime;
