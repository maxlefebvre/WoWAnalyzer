import { GuideProps, Section, SubSection } from 'interface/guide';
import CombatLogParser from './CombatLogParser';
import PreparationSection from 'interface/guide/components/Preparation/PreparationSection';
import CooldownGraphSubsection from './modules/guide/CooldownSubsection';
import ResourceSubsection from './modules/guide/ResourceSubsection';
import CastingSubsection from './modules/guide/CastingSubsection';

export default function Guide({ modules, events, info }: GuideProps<typeof CombatLogParser>) {
  return (
    <>
      <Section title="Core">
        <Section title="SoulShards">
          <ResourceSubsection.ResourceSubsection modules={modules} events={events} info={info} />{' '}
        </Section>
        <Section title="DoTs">{modules.dotUptimes.guideSubsection}</Section>

        <Section title="Active Time">
          <CastingSubsection.CastingSubsection modules={modules} events={events} info={info} />
        </Section>
      </Section>

      <Section title="Cooldowns">
        <CooldownGraphSubsection.CooldownGraph />
      </Section>

      <Section title="Proc Usage">
        <SubSection>Coming Soon!</SubSection>
      </Section>

      <Section title="Action Priority List">
        <SubSection>Coming Soon!</SubSection>
      </Section>

      <PreparationSection />
    </>
  );
}
