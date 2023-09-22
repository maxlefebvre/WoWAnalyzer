import { defineMessage } from '@lingui/macro';
import ThresholdPerformancePercentage from 'analysis/retail/shaman/elemental/modules/features/shared/ThresholdPerformancePercentage';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/warlock';
import { Expandable, SpellLink } from 'interface';
import { SectionHeader, SubSection } from 'interface/guide';
import Statistics from 'interface/icons/Statistics';
import { GlobalCooldownEvent } from 'parser/core/Events';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import CoreAlwaysBeCasting from 'parser/shared/modules/AlwaysBeCasting';
import getUptimeGraph, { UptimeHistoryEntry } from 'parser/shared/modules/getUptimeGraph';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

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

  get guideSubsection() {
    const abcSuggestionThreshold = this.suggestionThresholds;

    return (
      <SubSection title="Always be casting">
        <p>
          As long as you have a target, there is <strong>always</strong> something you can cast as
          an Elemental shaman. This means that you should try to be on global cooldown for as much
          as you possibly can throughout the entire encounter. Any time you are not casting is time
          that you are not doing damage.
        </p>

        <p>
          A key factor to achieving high uptime as a caster is correct positioning and movement.
          Throughout the fight, it is very important that you proactively anticipate where you need
          to stand and/or move for mechanics. Doing this properly will minimize forced downtime of
          having to move longer distances.
        </p>

        <p>
          You spendt{' '}
          <ThresholdPerformancePercentage
            threshold={{
              type: 'gte',
              perfect: abcSuggestionThreshold.isGreaterThan.minor,
              good: abcSuggestionThreshold.isGreaterThan.average,
              ok: abcSuggestionThreshold.isGreaterThan.major,
            }}
            percentage={this.activeTimePercentage}
          />{' '}
          of the encounter in global cooldown.
        </p>

        <small>
          There will be some time where you cannot cast, for example during intermissions. You
          should evaluate your performance based on fight specific mechanics.
        </small>

        <Expandable
          header={
            <SectionHeader>
              <Statistics /> Active time timeline graph
            </SectionHeader>
          }
          element="section"
        >
          {getUptimeGraph(this.uptimeHistory, this.owner.fight.start_time)}
        </Expandable>
      </SubSection>
    );
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
}

export default AlwaysBeCasting;
