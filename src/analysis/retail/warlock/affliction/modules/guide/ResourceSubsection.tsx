import { GuideProps } from 'interface/guide';
import CombatLogParser from 'analysis/retail/warlock/affliction/CombatLogParser';

function ResourceSubsection({ modules }: GuideProps<typeof CombatLogParser>) {
  return (
    <p>
      These are your primary spending resource as a Warlock. Instead of spells having cooldowns,
      you'll be gated by the amount of Soul Shards you have available. Outside of combat you
      passively regenerate up to 3 shards.
      {modules.soulshardGraph.plot}
    </p>
  );
}

export default { ResourceSubsection };
