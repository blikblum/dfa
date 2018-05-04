const INITIAL_STATE = 1;
const FAIL_STATE = 0;

/**
 * A StateMachine represents a deterministic finite automaton.
 * It can perform matches over a sequence of values, similar to a regular expression.
 */
export default class StateMachine {
  constructor(dfa) {
    this.stateTable = dfa.stateTable;
    this.accepting = dfa.accepting;
    this.tags = dfa.tags;
  }

  /**
   * Returns an array with matches over the input sequence.
   * Matches are of the form [startIndex, endIndex, tags].
   */
  match(str) {
    let result = [];

    let state = INITIAL_STATE;
    let startRun = null;
    let lastAccepting = null;
    let lastState = null;

    for (let p = 0; p < str.length; p++) {
      let c = str[p];

      lastState = state;
      state = this.stateTable[state][c];

      if (state === FAIL_STATE) {
        // yield the last match if any
        if (startRun != null && lastAccepting != null && lastAccepting >= startRun) {
          result.push([startRun, lastAccepting, this.tags[lastState]]);
        }

        // reset the state as if we started over from the initial state
        state = this.stateTable[INITIAL_STATE][c];
        startRun = null;
      }

      // start a run if not in the failure state
      if (state !== FAIL_STATE && startRun == null) {
        startRun = p;
      }

      // if accepting, mark the potential match end
      if (this.accepting[state]) {
        lastAccepting = p;
      }

      // reset the state to the initial state if we get into the failure state
      if (state === FAIL_STATE) {
        state = INITIAL_STATE;
      }
    }

    // yield the last match if any
    if (startRun != null && lastAccepting != null && lastAccepting >= startRun) {
      result.push([startRun, lastAccepting, this.tags[state]]);
    }

    return result;
  }

  /**
   * For each match over the input sequence, action functions matching
   * the tag definitions in the input pattern are called with the startIndex,
   * endIndex, and sub-match sequence.
   */
  apply(str, actions) {
    let matches = this.match(str);
    for (let i = 0; i < matches.length; i++) {
      let [start, end, tags] = matches[i];
      for (let j = 0; j < tags.length; j++) {
        let tag = tags[j];
        if (typeof actions[tag] === 'function') {
          actions[tag](start, end, str.slice(start, end + 1));
        }
      }
    }
  }
}
