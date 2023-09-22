import { GuideProps, Section, SubSection } from 'interface/guide';
import CombatLogParser from './CombatLogParser';
import { TALENTS_WARLOCK } from 'common/TALENTS';
import { formatPercentage } from 'common/format';
import CastEfficiencyBar from 'parser/ui/CastEfficiencyBar';
import { GapHighlight } from 'parser/ui/CooldownBar';
import SPELLS from 'common/SPELLS';

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
        {/* TODO: Extract to shared this is copy paste form demo */}
        <p>
          These are your primary spending resource as a Warlock. Instead of spells having cooldowns,
          you'll be gated by the amount of Soul Shards you have available. Outside of combat you
          passively regenerate up to 3 shards.
          {modules.soulshardGraph.plot}
        </p>
      </SubSection>
    </Section>
  );
}

function RotationSection({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <Section title="Rotation">
      <SubSection>TODO - SPENDER USE</SubSection>
      {modules.dotUptimes.guideSubsection}
    </Section>
  );
}

function CooldownsSection({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <Section title="Cooldowns">
      <p>
        Balance's cooldowns are moderately powerful and as with most DPS specs they should not be
        held for long. In order to maximize usages over the course of an encounter, aim to send the
        cooldown as soon as it becomes available (as long as you can be active on target over its
        duration).
      </p>
      <CooldownGraphSubsection modules={modules} events={events} info={info} />
      <CooldownBreakdownSubsection modules={modules} events={events} info={info} />
    </Section>
  );
}

function CooldownGraphSubsection({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <SubSection>
      <strong>Cooldown Graph</strong> - this graph shows when you used your cooldowns and how long
      you waited to use them again. Grey segments show when the spell was available, yellow segments
      show when the spell was cooling down. Red segments highlight times when you could have fit a
      whole extra use of the cooldown.
      {info.combatant.hasTalent(TALENTS_WARLOCK.SUMMON_DARKGLARE_TALENT) && (
        <CastEfficiencyBar
          spellId={SPELLS.SUMMON_DARKGLARE.id}
          gapHighlightMode={GapHighlight.FullCooldown}
          useThresholds
        />
      )}
      {info.combatant.hasTalent(TALENTS_WARLOCK.PHANTOM_SINGULARITY_TALENT) && (
        <CastEfficiencyBar
          spellId={TALENTS_WARLOCK.PHANTOM_SINGULARITY_TALENT.id}
          gapHighlightMode={GapHighlight.FullCooldown}
          useThresholds
        />
      )}
      {info.combatant.hasTalent(TALENTS_WARLOCK.VILE_TAINT_TALENT) && (
        <CastEfficiencyBar
          spellId={TALENTS_WARLOCK.VILE_TAINT_TALENT.id}
          gapHighlightMode={GapHighlight.FullCooldown}
          useThresholds
        />
      )}
      {info.combatant.hasTalent(TALENTS_WARLOCK.SOUL_ROT_TALENT) && (
        <CastEfficiencyBar
          spellId={TALENTS_WARLOCK.SOUL_ROT_TALENT.id}
          gapHighlightMode={GapHighlight.FullCooldown}
          useThresholds
        />
      )}
    </SubSection>
  );
}

function CooldownBreakdownSubsection({
  modules,
  events,
  info,
}: GuideProps<typeof CombatLogParser>) {
  return <SubSection>TODO - COOLDOWN BREAKDOWNS</SubSection>;
}
