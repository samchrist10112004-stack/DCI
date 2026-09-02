// DCI PLATFORM: DYNAMIC FORENSIC TESTING LABORATORY

class ForensicLab {
  constructor() {
    this.completedTests = [];
  }

  render() {
    const testsListElem = document.getElementById('forensic-tests-list');
    const resultsListElem = document.getElementById('forensic-results-list');

    if (!testsListElem || !resultsListElem || typeof window.CASE_DATA === 'undefined' || !window.CASE_DATA.forensicTests) return;

    testsListElem.innerHTML = window.CASE_DATA.forensicTests.map(test => {
      const isDone = this.completedTests.includes(test.id);
      return `
        <div class="test-item-card">
          <div class="test-info">
            <h4>${test.name}</h4>
            <p>Target Clue: <span class="badge blue">${test.itemRequired || test.target || 'General Sector'}</span></p>
            <div class="test-costs">Cost: $${test.cost} | Time: ${test.timeHours || test.time || 4} Game Hours</div>
          </div>
          <div>
            ${isDone ? 
              `<span class="badge green">COMPLETED</span>` : 
              `<button class="btn-dci primary" onclick="forensicLab.runTest('${test.id}')">RUN TEST</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    if (this.completedTests.length === 0) {
      resultsListElem.innerHTML = `<div class="chat-msg system">NO FORENSIC TESTS CONDUCTED YET. SELECT A TEST TO EXECUTE ANALYSIS.</div>`;
    } else {
      resultsListElem.innerHTML = this.completedTests.map(testId => {
        const test = window.CASE_DATA.forensicTests.find(t => t.id === testId);
        if (!test) return '';
        return `
          <div style="background:#090e1a; border:1px solid var(--accent-green); padding:12px; border-radius:4px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:bold; color:var(--accent-amber); font-size:0.85rem;">[OFFICIAL LAB REPORT] ${test.name}</span>
              <span class="badge green">VERIFIED</span>
            </div>
            <p style="font-size:0.8rem; color:#e2e8f0; line-height:1.4;">${test.result || test.output}</p>
          </div>
        `;
      }).join('');
    }
  }

  runTest(testId) {
    if (typeof window.CASE_DATA === 'undefined' || !window.CASE_DATA.forensicTests) return;
    const test = window.CASE_DATA.forensicTests.find(t => t.id === testId);
    if (!test || this.completedTests.includes(testId)) return;

    const cost = test.cost || 500;
    const timeHours = test.timeHours || test.time || 4;

    if (window.gameEngine && window.gameEngine.consumeBudget(cost)) {
      window.gameEngine.consumeTime(timeHours, `Forensic Test: ${test.name}`);
      this.completedTests.push(testId);
      if (window.audioEngine) window.audioEngine.playStamp();
      this.render();
    }
  }
}

window.forensicLab = new ForensicLab();
