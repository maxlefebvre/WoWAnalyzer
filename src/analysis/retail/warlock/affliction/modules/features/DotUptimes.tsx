import Analyzer from 'parser/core/Analyzer';
import StatisticBar from 'parser/ui/StatisticBar';
import { STATISTIC_ORDER } from 'parser/ui/StatisticsListBox';

import Agony from '../spells/Agony';
import Corruption from '../spells/Corruption';
import Haunt from '../spells/Haunt';
import ShadowEmbrace from '../spells/ShadowEmbrace';
import SiphonLife from '../spells/SiphonLife';
import UnstableAffliction from '../spells/UnstableAffliction';
import { RoundedPanel } from 'interface/guide/components/GuideDivs';
import { explanationAndDataSubsection } from 'interface/guide/components/ExplanationRow';

class DotUptimeStatisticBox extends Analyzer {
  static dependencies = {
    agonyUptime: Agony,
    corruptionUptime: Corruption,
    hauntUptime: Haunt,
    shadowEmbraceUptime: ShadowEmbrace,
    siphonLifeUptime: SiphonLife,
    unstableAfflictionUptime: UnstableAffliction,
  };
  protected agonyUptime!: Agony;
  protected corruptionUptime!: Corruption;
  protected hauntUptime!: Haunt;
  protected shadowEmbraceUptime!: ShadowEmbrace;
  protected siphonLifeUptime!: SiphonLife;
  protected unstableAfflictionUptime!: UnstableAffliction;

  // TODO: Add explanation and check each implementation
  get guideSubsection() {
    const explanation = (
      <p>
        <b>
          Keep your DoTs up on the boss. <br />
        </b>
        Affliction Warlocks rely heavily on DoTs in order to deal damage to the target. You should
        try and have as high of an uptime as possible.
      </p>
    );

    const data = (
      <RoundedPanel>
        <strong>DoT Uptimes</strong>
        {this.agonyUptime.subStatistic()}
        {this.corruptionUptime.subStatistic()}
        {this.unstableAfflictionUptime.subStatistic()}
        {this.shadowEmbraceUptime.subStatistic()}
        {this.hauntUptime.active && this.hauntUptime.subStatistic()}
        {this.siphonLifeUptime.active && this.siphonLifeUptime.subStatistic()}
      </RoundedPanel>
    );

    return explanationAndDataSubsection(explanation, data);
  }
  statistic() {
    return (
      <StatisticBar wide position={STATISTIC_ORDER.CORE(1)}>
        {this.agonyUptime.subStatistic()}
        {this.corruptionUptime.subStatistic()}
        {this.unstableAfflictionUptime.subStatistic()}
        {this.siphonLifeUptime.active && this.siphonLifeUptime.subStatistic()}
        {this.shadowEmbraceUptime.subStatistic()}
        {this.hauntUptime.active && this.hauntUptime.subStatistic()}
      </StatisticBar>
    );
  }
}

export default DotUptimeStatisticBox;
