import { GuideProps } from 'interface/guide';
import CombatLogParser from 'analysis/retail/warlock/affliction/CombatLogParser';
import PerformanceStrong from 'interface/PerformanceStrong';

function ResourceSubsection({ modules }: GuideProps<typeof CombatLogParser>) {
  return (
    <p>
      <b>
        You wasted{' '}
        <PerformanceStrong performance={modules.soulShardDetails.WastedSoulShardPerformance}>
          {modules.soulShardDetails.wastedPerMinute.toFixed(1)}
        </PerformanceStrong>{' '}
        Soul Shards per minute.
      </b>
      <br />
      The chart below shows your Soul Shards over the course of the encounter. These are your
      primary spending resource as a Warlock. Instead of spells having cooldowns, you'll be gated by
      the amount of Soul Shards you have available. Outside of combat you passively regenerate up to
      3 shards.
      {modules.soulshardGraph.plot}
    </p>
  );
}

export default { ResourceSubsection };
