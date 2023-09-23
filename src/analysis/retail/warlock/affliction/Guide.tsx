import { GuideProps, Section, SubSection } from 'interface/guide';
import CombatLogParser from './CombatLogParser';
import { TALENTS_WARLOCK } from 'common/TALENTS';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import CooldownGraphSubsection, {
  Cooldown,
} from 'interface/guide/components/CooldownGraphSubSection';

// TODO: Refactor structure - maybe similar to spriest

const cooldownTalents: Cooldown[] = [
  {
    spell: SPELLS.SUMMON_DARKGLARE,
    isActive: (c) => c.hasTalent(TALENTS_WARLOCK.SUMMON_DARKGLARE_TALENT),
  },
  {
    spell: TALENTS_WARLOCK.PHANTOM_SINGULARITY_TALENT,
    isActive: (c) => c.hasTalent(TALENTS_WARLOCK.PHANTOM_SINGULARITY_TALENT),
  },
  {
    spell: TALENTS_WARLOCK.VILE_TAINT_TALENT,
    isActive: (c) => c.hasTalent(TALENTS_WARLOCK.VILE_TAINT_TALENT),
  },
  {
    spell: TALENTS_WARLOCK.SOUL_ROT_TALENT,
    isActive: (c) => c.hasTalent(TALENTS_WARLOCK.SOUL_ROT_TALENT),
  },
];

export default function Guide({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <>
      <CoreSection modules={modules} events={events} info={info} />
      <RotationSection modules={modules} events={events} info={info} />
      <CooldownsSection modules={modules} events={events} info={info} />
    </>
  );
}

function CoreSection({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <Section title="Core">
      <SubSection title="Always be Casting">
        <p>
          <em>
            <b>
              Continuously chaining casts throughout an encounter is the single most important thing
              for achieving good DPS as a caster.
            </b>
          </em>
          <br />
          There should be no delay at all between your spell casts, it's better to start casting the
          wrong spell than to think for a few seconds and then cast the right spell. You should be
          able to handle a fight's mechanics with the minimum possible interruption to your casting.
          Some fights have unavoidable downtime due to phase transitions and the like, so in these
          cases 0% downtime will not be possible - do the best you can.
        </p>
        Active Time:{' '}
        <strong>{formatPercentage(modules.alwaysBeCasting.activeTimePercentage, 1)}%</strong>
        <br />
        TODO ACTIVE TIME GRAPH
      </SubSection>
      <SubSection title="Soul Shards">
        <p>
          These are your primary spending resource as a Warlock. Instead of spells having cooldowns,
          you'll be gated by the amount of Soul Shards you have available. Outside of combat you
          passively regenerate up to 3 shards.
          {modules.soulshardGraph.plot}
        </p>
      </SubSection>
      {/* TODO: Spender usage? */}
    </Section>
  );
}

function RotationSection({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return <Section title="Rotation">{modules.dotUptimes.guideSubsection}</Section>;
}

function CooldownsSection({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <Section title="Cooldowns">
      <p>
        Be mindful of your cooldowns if you are specced into them and use them when it's
        appropriate. It's okay to hold a cooldown for a little bit when the encounter requires it
        (burn phases), but generally speaking you should use them as much as you can..
      </p>
      <SubSection title="Offensive Cooldowns">
        <CooldownGraphSubsection
          cooldowns={cooldownTalents}
          description={
            <p>
              <strong>Cooldown Graph</strong> - this graph shows when you used your cooldowns and
              how long you waited to use them again. Grey segments show when the spell was
              available, yellow segments show when the spell was cooling down. Red segments
              highlight times when you could have fit a whole extra use of the cooldown.
            </p>
          }
        />
      </SubSection>
      <CooldownBreakdownSubsection modules={modules} events={events} info={info} />
    </Section>
  );
}

function CooldownBreakdownSubsection({
  modules,
  events,
  info,
}: GuideProps<typeof CombatLogParser>) {
  return <SubSection>TODO - COOLDOWN BREAKDOWNS</SubSection>;
}
