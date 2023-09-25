import SPELLS from 'common/SPELLS';
import RESOURCE_TYPES from 'game/RESOURCE_TYPES';
import { Options } from 'parser/core/Analyzer';
import { CastEvent } from 'parser/core/Events';
import ResourceTracker from 'parser/shared/modules/resources/resourcetracker/ResourceTracker';
import { QualitativePerformance } from 'parser/ui/QualitativePerformance';

class SoulShardTracker extends ResourceTracker {
  constructor(options: Options) {
    super(options);
    this.resource = RESOURCE_TYPES.SOUL_SHARDS;
  }

  get WastedSoulShardPerformance(): QualitativePerformance {
    const wasted = this.wasted;
    if (wasted <= 0) {
      return QualitativePerformance.Perfect;
    }
    if (wasted <= 5) {
      return QualitativePerformance.Good;
    }
    if (wasted <= 10) {
      return QualitativePerformance.Ok;
    }
    return QualitativePerformance.Fail;
  }

  onCast(event: CastEvent) {
    const classResources = this.getResource(event);
    if (classResources) {
      classResources.amount /= 10;
      classResources.cost = classResources.cost ? classResources.cost / 10 : 0;
      classResources.max /= 10;
      super.onCast(event);
    }
  }

  getAdjustedCost(event: CastEvent) {
    let cost = super.getAdjustedCost(event) ?? 0;
    // Demonic Calling (T30 talent) proc reduces the cost of next Call Dreadstalkers by 1 shard
    if (
      event.ability.guid === SPELLS.CALL_DREADSTALKERS.id &&
      this.selectedCombatant.hasBuff(SPELLS.DEMONIC_CALLING_BUFF.id)
    ) {
      cost -= 1;
    }
    return cost;
  }
}

export default SoulShardTracker;
