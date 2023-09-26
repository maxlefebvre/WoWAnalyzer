import ShadowEmbraceStackTracker from './ShadowEmbraceStackTracker';
import DebuffStackGraph from 'parser/shared/modules/DebuffStackGraph';

export default class FrenzyBuffStackGraph extends DebuffStackGraph {
  static dependencies = {
    ...DebuffStackGraph.dependencies,
    shadowEmbraceStackTracker: ShadowEmbraceStackTracker,
  };

  shadowEmbraceStackTracker!: ShadowEmbraceStackTracker;

  tracker() {
    return this.shadowEmbraceStackTracker;
  }

  // plot included in Guide
}
