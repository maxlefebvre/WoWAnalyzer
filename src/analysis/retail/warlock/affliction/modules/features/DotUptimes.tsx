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
import TALENTS from 'common/TALENTS/warlock';
import SpellLink from 'interface/SpellLink';
import SPELLS from 'common/SPELLS';
import UptimeStackBar from 'parser/ui/UptimeStackBar';
import DreadTouch from '../spells/DreadTouch';
import { PerformanceLabel } from 'parser/ui/PerformanceLabel';
import { formatPercentage } from 'common/format';
import { TooltipElement } from 'interface';

class DotUptimeStatisticBox extends Analyzer {
  static dependencies = {
    agonyUptime: Agony,
    corruptionUptime: Corruption,
    hauntUptime: Haunt,
    shadowEmbraceUptime: ShadowEmbrace,
    siphonLifeUptime: SiphonLife,
    unstableAfflictionUptime: UnstableAffliction,
    dreadTouchUptime: DreadTouch,
  };
  protected agonyUptime!: Agony;
  protected corruptionUptime!: Corruption;
  protected hauntUptime!: Haunt;
  protected shadowEmbraceUptime!: ShadowEmbrace;
  protected siphonLifeUptime!: SiphonLife;
  protected unstableAfflictionUptime!: UnstableAffliction;
  protected dreadTouchUptime!: DreadTouch;

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
        {this.hauntUptime.active && this.hauntUptime.subStatistic()}
        {this.siphonLifeUptime.active && this.siphonLifeUptime.subStatistic()}
      </RoundedPanel>
    );

    return explanationAndDataSubsection(explanation, data);
  }

  get guideSubsectionShadowEmbrace() {
    const explanation = (
      <p>
        <b>
          Try to maximize the the uptime at 3 stacks of{' '}
          <SpellLink spell={TALENTS.SHADOW_EMBRACE_TALENT} /> by refreshing with{' '}
          <SpellLink spell={SPELLS.DRAIN_SOUL_DEBUFF} />
        </b>
        <br />
        Unlike your DoTs, it does not deal direct damage but instead increases all damage dealt to
        the target stacking up to 3 times.this.owner.fight.start_time
      </p>
    );

    const data = (
      <RoundedPanel>
        <strong>
          <SpellLink spell={SPELLS.SHADOW_EMBRACE_DEBUFF} /> uptime
        </strong>
        <div className="flex-main">
          <div className="flex-sub bar-label">
            <PerformanceLabel performance={this.shadowEmbraceUptime.DowntimePerformance}>
              {' '}
              {formatPercentage((this.shadowEmbraceUptime as ShadowEmbrace).totalUptimePercentage)}%
            </PerformanceLabel>{' '}
            <TooltipElement
              content={
                <>
                  No stacks: {formatPercentage(this.shadowEmbraceUptime.stackedUptime[0])} %<br />1
                  stack: {formatPercentage(this.shadowEmbraceUptime.stackedUptime[1])} %<br />2
                  stacks: {formatPercentage(this.shadowEmbraceUptime.stackedUptime[2])} %
                  <br />3 stacks: {formatPercentage(this.shadowEmbraceUptime.stackedUptime[3])} %
                </>
              }
            >
              <small>uptime</small>
            </TooltipElement>
          </div>
          <div
            style={{
              height: '40px',
            }}
          >
            {
              // TODO: move this to a BuffStackGraph.  That's a bit more
              // complicated as that is built to work with a BuffStackTracker.
              // However, this is a debuff count!
            }
            <UptimeStackBar
              start={this.owner.fight.start_time}
              end={this.owner.fight.end_time}
              barColor={this.shadowEmbraceUptime.debuffColor}
              timeTooltip
              {...this.shadowEmbraceUptime.stackUptime()}
            />
          </div>
        </div>
      </RoundedPanel>
    );

    return explanationAndDataSubsection(explanation, data);
  }

  get guideSubsectionDreadTouch() {
    const explanation = (
      <p>
        <b>
          Try to maintain <SpellLink spell={SPELLS.DREAD_TOUCH_DEBUFF} /> uptime as high as possible
          by refreshing it with <SpellLink spell={SPELLS.MALEFIC_RAPTURE} />
        </b>
        <br />
        You may not be able to maintain this debuff at all times but you can maximize its uptime by
        delaying casting <SpellLink spell={SPELLS.MALEFIC_RAPTURE} />
        unless you will overcap soul shards or conversly by earlier to refresh the debuff.
      </p>
    );

    const data = (
      <RoundedPanel>
        <strong>
          <SpellLink spell={SPELLS.DREAD_TOUCH_DEBUFF} /> uptime
        </strong>
        {this.dreadTouchUptime.active && this.dreadTouchUptime.subStatistic()}
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
        {this.shadowEmbraceUptime.active && this.shadowEmbraceUptime.subStatistic()}
        {this.hauntUptime.active && this.hauntUptime.subStatistic()}
      </StatisticBar>
    );
  }
}

export default DotUptimeStatisticBox;
