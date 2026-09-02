// OPERATION BLACKWOOD: GAME STATE & TIME ENGINE

class GameEngine {
  constructor() {
    this.state = {
      timeRemaining: 72,
      budget: 5000,
      pressures: {
        political: 25,
        media: 40,
        superior: 15
      },
      discoveredEvidence: ["EVD-01", "EVD-02", "EVD-03", "EVD-04"],
      interrogationLogs: {},
      completedTests: [],
      hypotheses: [],
      connectedStrings: [],
      gameOver: false,
      verdict: null
    };

    this.onStateChangeCallbacks = [];
  }

  subscribe(callback) {
    this.onStateChangeCallbacks.push(callback);
  }

  notifyStateChange() {
    this.onStateChangeCallbacks.forEach(cb => cb(this.state));
  }

  consumeTime(hours, actionName = "Investigation Step") {
    if (this.state.gameOver) return;

    this.state.timeRemaining = Math.max(0, this.state.timeRemaining - hours);
    this.state.pressures.political = Math.min(100, this.state.pressures.political + hours * 0.8);
    this.state.pressures.media = Math.min(100, this.state.pressures.media + hours * 1.2);
    this.state.pressures.superior = Math.min(100, this.state.pressures.superior + hours * 0.9);

    if (window.audioEngine) window.audioEngine.playBeep(450, 0.08);

    this.updateSuspectStatesOverTime();

    if (this.state.timeRemaining <= 0) {
      this.triggerTimeExpired();
    }

    this.notifyStateChange();
  }

  consumeBudget(amount) {
    if (this.state.budget >= amount) {
      this.state.budget -= amount;
      this.notifyStateChange();
      return true;
    }
    if (window.audioEngine) window.audioEngine.playBuzzer();
    alert("INSUFFICIENT FORENSIC BUDGET! Request denied.");
    return false;
  }

  discoverEvidence(evidenceId) {
    if (!this.state.discoveredEvidence.includes(evidenceId)) {
      this.state.discoveredEvidence.push(evidenceId);
      if (window.audioEngine) window.audioEngine.playStamp();

      // RE-RENDER ALL EVIDENCE CONSUMERS INSTANTLY IN REALTIME!
      if (typeof renderCaseEvidenceLocker === 'function') {
        renderCaseEvidenceLocker();
      }
      if (window.caseBoard && typeof window.caseBoard.syncEvidenceNodes === 'function') {
        window.caseBoard.syncEvidenceNodes();
      }
      if (window.forensicLab && typeof window.forensicLab.render === 'function') {
        window.forensicLab.render();
      }
      if (window.interrogationEngine && typeof window.interrogationEngine.render === 'function') {
        window.interrogationEngine.render();
      }

      this.notifyStateChange();
    }
  }

  updateSuspectStatesOverTime() {
    if (typeof CASE_DATA === 'undefined' || !CASE_DATA.suspects) return;
    CASE_DATA.suspects.forEach(suspect => {
      if (this.state.timeRemaining < 24 && suspect.gauges && suspect.gauges.stress > 75 && !suspect.lawyer) {
        suspect.lawyer = true;
      }
    });
  }

  triggerTimeExpired() {
    this.state.gameOver = true;
    if (window.audioEngine) window.audioEngine.playBuzzer();
    alert("CRITICAL WARNING: 72-HOUR INVESTIGATION DEADLINE EXPIRED! Case surrendered to Special Prosecution Unit.");
  }
}

window.gameEngine = new GameEngine();
