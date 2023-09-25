import { Section, SubSection, GuideProps } from 'interface/guide';
import { formatPercentage } from 'common/format';
import CombatLogParser from 'analysis/retail/warlock/affliction/CombatLogParser';
import PerformanceStrong from 'interface/PerformanceStrong';
import SPELLS from 'common/SPELLS/warlock';
import { SpellLink } from 'interface';

function CastingSubsection({ modules }: GuideProps<typeof CombatLogParser>) {
  return (
    <SubSection>
      <p>
        <b>
          Continuously casting throughout an encounter is the single most important thing for
          achieving good DPS as a caster.
        </b>
        <br />
        When you have to move, use your instant abilities or try to utilize{' '}
        <SpellLink spell={SPELLS.DEMONIC_CIRCLE} icon>
          Teleport
        </SpellLink>{' '}
        or{' '}
        <SpellLink spell={SPELLS.DEMONIC_GATEWAY_CAST} icon>
          Gateway
        </SpellLink>{' '}
        to reduce the movement even further. Some fights have unavoidable downtime due to phase
        transitions and the like, so in these cases 0% downtime will not be possible - do the best
        you can.
      </p>
      <p>
        Active Time:{' '}
        <PerformanceStrong performance={modules.alwaysBeCasting.DowntimePerformance}>
          {formatPercentage(modules.alwaysBeCasting.activeTimePercentage, 1)}%
        </PerformanceStrong>{' '}
        Cancelled Casts:{' '}
        <PerformanceStrong performance={modules.cancelledCasts.CancelledPerformance}>
          {formatPercentage(modules.cancelledCasts.Canceled, 1)}%
        </PerformanceStrong>{' '}
      </p>
      <Section title="Active Time Graph">{modules.alwaysBeCasting.graphSubsection}</Section>
    </SubSection>
  );
}

export default { CastingSubsection };
