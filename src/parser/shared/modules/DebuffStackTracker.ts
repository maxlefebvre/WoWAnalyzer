import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Spell from 'common/SPELLS/Spell';
import Events, {
  Ability,
  ApplyDebuffEvent,
  ApplyDebuffStackEvent,
  FightEndEvent,
  RemoveDebuffEvent,
  RemoveDebuffStackEvent,
} from 'parser/core/Events';

type DebuffStackUpdate = {
  /** What triggered this update */
  type: string;
  /** This update's timestamp */
  timestamp: number;
  /** Instant change of resources with this update (negative indicates a spend or drain)
   *  This is the 'effective' change only */
  change: number;
  /** Amount of resource the player has AFTER the change */
  current: number;
};

const DEBUG = false;

export default class DebuffStackTracker extends Analyzer {
  /** The spell to track */
  static trackedDebuff: Spell | Spell[];

  /** Time ordered list of buff stack updates */
  debuffStackUpdates: DebuffStackUpdate[] = [];

  constructor(options: Options) {
    super(options);
    this.addEventListener(
      Events.applydebuff.by(SELECTED_PLAYER).spell(this.trackedDebuff),
      this.onApplyDebuff,
    );
    this.addEventListener(
      Events.applydebuffstack.by(SELECTED_PLAYER).spell(this.trackedDebuff),
      this.onApplyDebuffStack,
    );
    this.addEventListener(
      Events.removedebuff.by(SELECTED_PLAYER).spell(this.trackedDebuff),
      this.onRemoveDebuff,
    );
    this.addEventListener(
      Events.removedebuffstack.by(SELECTED_PLAYER).spell(this.trackedDebuff),
      this.onRemoveDebuffStack,
    );
    this.addEventListener(Events.fightend, this.onFightEnd);
  }

  get trackedDebuff() {
    const ctor = this.constructor as typeof DebuffStackTracker;
    return ctor.trackedDebuff;
  }

  /** The player's buff stack amount at the current timestamp */
  get current(): number {
    const lastUpdate = this.debuffStackUpdates.at(-1);
    if (!lastUpdate) {
      // there have been no updates so far, return a default
      return 0;
    }
    return lastUpdate.current;
  }

  onApplyDebuff(event: ApplyDebuffEvent) {
    this._logAndPushUpdate(
      {
        type: event.type,
        timestamp: event.timestamp,
        change: 1,
        current: 1,
      },
      event.ability,
    );
  }

  onApplyDebuffStack(event: ApplyDebuffStackEvent) {
    this._logAndPushUpdate(
      {
        type: event.type,
        timestamp: event.timestamp,
        change: event.stack - this.current,
        current: event.stack,
      },
      event.ability,
    );
  }

  onRemoveDebuff(event: RemoveDebuffEvent) {
    this._logAndPushUpdate(
      {
        type: event.type,
        timestamp: event.timestamp,
        change: -this.current,
        current: 0,
      },
      event.ability,
    );
  }

  onRemoveDebuffStack(event: RemoveDebuffStackEvent) {
    this._logAndPushUpdate(
      {
        type: event.type,
        timestamp: event.timestamp,
        change: event.stack - this.current,
        current: event.stack,
      },
      event.ability,
    );
  }

  onFightEnd(event: FightEndEvent) {
    this._logAndPushUpdate({
      type: event.type,
      timestamp: event.timestamp,
      change: -this.current,
      current: 0,
    });
  }

  _logAndPushUpdate(update: DebuffStackUpdate, spell?: Ability) {
    if (DEBUG) {
      console.log(
        'Update for ' + spell?.name + ' @ ' + this.owner.formatTimestamp(update.timestamp, 1),
        update,
      );
    }
    this.debuffStackUpdates.push(update);
  }
}
