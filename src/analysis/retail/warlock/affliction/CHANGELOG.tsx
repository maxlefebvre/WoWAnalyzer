import { change, date } from 'common/changelog';
import SPELLS from 'common/SPELLS';
import TALENTS from 'common/TALENTS/warlock';
import { Arlie, Jonfanz, Meldris, ToppleTheNun, dodse, dode} from 'CONTRIBUTORS';
import { SpellLink } from 'interface';

export default [
  change(date(2023, 9, 21), 'Revamp to guide format', dode), // TODO: Fix date
  change(date(2023, 7, 31), 'Update CDR on Dark Pact and Unending Resolve', Arlie),
  change(date(2023, 7, 8), 'Update SpellLink usage.', ToppleTheNun),
  change(date(2023, 7, 8), "Removed Demonic Circle use tracker in utility and defensive spells", Meldris),
  change(date(2023, 6, 29), "Updated ABOUT with current guide links", Meldris),
  change(date(2023, 3, 9), "Update Soul Conduit to take into account being a 2 rank talent and different scaling", dodse),
  change(date(2023, 3, 9), 'Update Vile Taint to track the right debuff id and rework hit tracking', dodse),
  change(date(2023, 3, 9), 'Add statistics for Pandemic Invocation, Inevitable Demise, Malefic Affliction and Wrath of Consumption', dodse),
  change(date(2023, 3, 9), 'Update Darkglare, Nightfall, Shadow Embrace for Dragonflight changes', dodse),
  change(date(2022, 11, 10), <>Fix <SpellLink spell={TALENTS.DRAIN_SOUL_TALENT} /> not showing as intended and add <SpellLink spell={SPELLS.IMP_SINGE_MAGIC} />.</>, Arlie),
  change(date(2022, 11, 9), 'Remove Shadowlands covenant abilities from checklist.', ToppleTheNun),
  change(date(2022, 10, 20), <>Fix <SpellLink spell={TALENTS.DRAIN_SOUL_TALENT} /> damage calculations and add initial support for <SpellLink spell={TALENTS.DREAD_TOUCH_TALENT} />.</>, Jonfanz),
  change(date(2022, 10, 14), 'Begin working on support for Dragonflight.', Jonfanz),
];
