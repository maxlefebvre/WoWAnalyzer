import { GuideProps, Section } from 'interface/guide';
import CombatLogParser from './CombatLogParser';
import PreparationSection from 'interface/guide/components/Preparation/PreparationSection';
import CooldownGraphSubsection from './modules/guide/CooldownSubsection';
import ResourceSubsection from './modules/guide/ResourceSubsection';
import CastingSubsection from './modules/guide/CastingSubsection';
import TALENTS from 'common/TALENTS/warlock';

export default function Guide({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <>
      <Section title="Core">
        <Section title="DoTs">
          {modules.dotUptimes.guideSubsection}
          {info.combatant.hasTalent(TALENTS.SHADOW_EMBRACE_TALENT) &&
            modules.dotUptimes.guideSubsectionShadowEmbrace}
          {info.combatant.hasTalent(TALENTS.DREAD_TOUCH_TALENT) &&
            modules.dotUptimes.guideSubsectionDreadTouch}
        </Section>

        <Section title="SoulShards">
          <ResourceSubsection.ResourceSubsection modules={modules} events={events} info={info} />{' '}
        </Section>

        <Section title="Active Time">
          <CastingSubsection.CastingSubsection modules={modules} events={events} info={info} />
        </Section>
      </Section>

      <Section title="Cooldowns">
        <CooldownGraphSubsection.CooldownGraph />
      </Section>

      <PreparationSection />
    </>
  );
}
