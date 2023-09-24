import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/warlock';
import CooldownGraphSubsection, {
  Cooldown,
} from 'interface/guide/components/CooldownGraphSubSection';

const cooldownTalents: Cooldown[] = [
  {
    spell: SPELLS.SUMMON_DARKGLARE,
    isActive: (c) => c.hasTalent(TALENTS.SUMMON_DARKGLARE_TALENT),
  },
  {
    spell: TALENTS.PHANTOM_SINGULARITY_TALENT,
    isActive: (c) => c.hasTalent(TALENTS.PHANTOM_SINGULARITY_TALENT),
  },
  {
    spell: TALENTS.VILE_TAINT_TALENT,
    isActive: (c) => c.hasTalent(TALENTS.VILE_TAINT_TALENT),
  },
  {
    spell: TALENTS.SOUL_ROT_TALENT,
    isActive: (c) => c.hasTalent(TALENTS.SOUL_ROT_TALENT),
  },
];

const CooldownGraph = () => {
  return (
    <CooldownGraphSubsection
      cooldowns={cooldownTalents}
      description={
        <p>
          <strong>Cooldown Graph</strong> - this graph shows when you used your cooldowns and how
          long you waited to use them again. Grey segments show when the spell was available, yellow
          segments show when the spell was cooling down. Red segments highlight times when you could
          have fit a whole extra use of the cooldown.
        </p>
      }
    />
  );
};

export default { CooldownGraph };
