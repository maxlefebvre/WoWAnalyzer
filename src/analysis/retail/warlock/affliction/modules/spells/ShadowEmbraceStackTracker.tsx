import SPELLS from 'common/SPELLS';
import { Options } from 'parser/core/Analyzer';
import DebuffStackTracker from 'parser/shared/modules/DebuffStackTracker';

export default class FrenzyBuffStackTracker extends DebuffStackTracker {
  static trackedDebuff = SPELLS.SHADOW_EMBRACE_DEBUFF;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(options: Options) {
    super(options);
  }
}
