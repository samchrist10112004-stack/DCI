// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) 3-CASE PROMOTION REVIEW ENGINE

class PromotionEngine {
  constructor() {}

  async renderProgressCard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = await window.dciApi.getPromotionStatus();
    if (!data) return;

    const completed = data.cases_completed || 0;
    const reqPerRank = data.required_cases_per_rank || 3;
    const modulo = completed % reqPerRank;
    const currentProgress = (completed > 0 && modulo === 0) ? reqPerRank : modulo;
    const pct = Math.min(100, Math.floor((currentProgress / reqPerRank) * 100));

    const isEligible = data.review_eligible;
    const status = data.promotion_status;

    container.innerHTML = `
      <div style="background:var(--bg-card); border:1px solid var(--border-color); border-radius:6px; padding:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <span style="font-size:0.68rem; color:var(--accent-amber); letter-spacing:1px; display:block;">CAREER PROGRESSION REVIEW</span>
            <h3 style="font-family:var(--font-mono); color:#fff; font-size:1.1rem;">RANK: ${data.current_rank} (L-0${data.current_clearance})</h3>
          </div>
          <span class="badge ${status === 'APPROVED' ? 'green' : status === 'DEFERRED' ? 'red' : 'blue'}">
            ${status === 'APPROVED' ? 'PROMOTION READY' : status === 'DEFERRED' ? 'REVIEW DEFERRED' : 'IN PROGRESS'}
          </span>
        </div>

        <div style="margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-secondary); margin-bottom:6px;">
            <span>3-CASE PROMOTION REQUIREMENT:</span>
            <span>${currentProgress} / ${reqPerRank} QUALIFYING INVESTIGATIONS</span>
          </div>
          <div style="height:8px; background:#060a12; border-radius:4px; overflow:hidden; border:1px solid #1e293b;">
            <div style="height:100%; width:${pct}%; background:${status === 'APPROVED' ? 'var(--accent-green)' : 'var(--accent-amber)'}; transition:width 0.4s ease;"></div>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr 1fr; gap:10px; background:#05080e; padding:10px; border-radius:4px; border:1px solid var(--border-color); font-size:0.72rem; text-align:center; margin-bottom:16px;">
          <div>
            <div style="color:var(--text-muted);">XP ACCUMULATED</div>
            <div style="color:#fff; font-weight:bold; margin-top:2px;">${data.metrics.xp.current} / ${data.metrics.xp.required}</div>
          </div>
          <div>
            <div style="color:var(--text-muted);">SUCCESS RATE</div>
            <div style="color:#fff; font-weight:bold; margin-top:2px;">${data.metrics.success_rate.current}% (Min ${data.metrics.success_rate.required}%)</div>
          </div>
          <div>
            <div style="color:var(--text-muted);">EVIDENCE ACCURACY</div>
            <div style="color:#fff; font-weight:bold; margin-top:2px;">${data.metrics.evidence_accuracy.current}% (Min ${data.metrics.evidence_accuracy.required}%)</div>
          </div>
          <div>
            <div style="color:var(--text-muted);">WRONGFUL ARRESTS</div>
            <div style="color:${data.metrics.wrongful_accusations.pass ? 'var(--accent-green)' : 'var(--accent-red)'}; font-weight:bold; margin-top:2px;">${data.metrics.wrongful_accusations.current} (Max ${data.metrics.wrongful_accusations.max_allowed})</div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center;">
          <button class="btn-dci" style="font-size:0.75rem;" onclick="promotionEngine.simulateTestCase()">+ SIMULATE TEST CASE COMPLETION (DEV TOOL)</button>
          
          ${isEligible ? 
            `<button class="btn-dci primary" onclick="promotionEngine.openReviewModal('${status}')">SUBMIT FOR PROMOTION REVIEW</button>` :
            `<button class="btn-dci" style="cursor:not-allowed; opacity:0.6;" disabled>${data.cases_remaining_for_review} MORE CASES REQUIRED FOR REVIEW</button>`
          }
        </div>
      </div>
    `;
  }

  async openReviewModal(status) {
    const data = await window.dciApi.getPromotionStatus();
    const modal = document.getElementById('modal-promotion-review');
    const body = document.getElementById('promotion-review-body');
    if (!modal || !body) return;

    if (status === 'APPROVED') {
      body.innerHTML = `
        <div style="font-family:var(--font-mono); text-align:center; padding:10px;">
          <span class="classified-stamp" style="font-size:1.2rem; color:var(--accent-green); border-color:var(--accent-green);">COMMAND BOARD EVALUATION: PASSED</span>
          <h2 style="color:#fff; font-size:1.4rem; margin:14px 0 6px;">PROMOTION APPROVED BY DCI DIRECTORATE</h2>
          <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:20px;">
            Congratulations, Detective. Having completed ${data.cases_completed} qualifying investigations with an accuracy rating of ${data.metrics.evidence_accuracy.current}%, Command has authorized your promotion.
          </p>

          <div style="background:#05080e; border:1px solid var(--accent-green); padding:16px; border-radius:6px; margin-bottom:20px; text-align:left;">
            <div style="font-size:0.78rem; color:var(--text-muted);">PROMOTION SUMMARY:</div>
            <div style="color:#fff; margin-top:6px;">PREVIOUS RANK: <strong style="color:var(--text-secondary);">${data.current_rank} (L-0${data.current_clearance})</strong></div>
            <div style="color:var(--accent-green); font-size:1.1rem; font-weight:bold; margin-top:4px;">NEW RANK: ${data.next_rank} (L-0${data.current_clearance + 1})</div>
            <div style="font-size:0.75rem; color:var(--accent-amber); margin-top:8px;">UNLOCKED: Access to Level 0${data.current_clearance + 1} restricted case files and advanced forensic tools!</div>
          </div>

          <button class="btn-dci primary" style="width:100%; justify-content:center; padding:12px;" onclick="promotionEngine.executePromotion()">ACCEPT PROMOTION & CLAIM NEW CLEARANCE BADGE</button>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div style="font-family:var(--font-mono); text-align:center; padding:10px;">
          <span class="classified-stamp" style="font-size:1.2rem; color:var(--accent-red); border-color:var(--accent-red);">COMMAND BOARD EVALUATION: DEFERRED</span>
          <h2 style="color:var(--accent-red); font-size:1.3rem; margin:14px 0 6px;">PROMOTION DEFERRED — UNMET CRITERIA</h2>
          <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom:20px;">
            Your 3-case investigation cycle has been reviewed. However, your performance metrics did not satisfy the minimum requirements for rank elevation.
          </p>

          <div style="background:#05080e; border:1px solid var(--accent-red); padding:16px; border-radius:6px; margin-bottom:20px; text-align:left; font-size:0.8rem;">
            <div style="font-weight:bold; color:#fff; margin-bottom:8px;">EVALUATION BREAKDOWN:</div>
            <div style="color:${data.metrics.success_rate.pass ? 'var(--accent-green)' : 'var(--accent-red)'}; margin-bottom:4px;">
              ${data.metrics.success_rate.pass ? '✓' : '✖'} Case Success Rate: ${data.metrics.success_rate.current}% (Required: ${data.metrics.success_rate.required}%)
            </div>
            <div style="color:${data.metrics.evidence_accuracy.pass ? 'var(--accent-green)' : 'var(--accent-red)'}; margin-bottom:4px;">
              ${data.metrics.evidence_accuracy.pass ? '✓' : '✖'} Evidence Accuracy: ${data.metrics.evidence_accuracy.current}% (Required: ${data.metrics.evidence_accuracy.required}%)
            </div>
            <div style="color:${data.metrics.wrongful_accusations.pass ? 'var(--accent-green)' : 'var(--accent-red)'}; margin-bottom:4px;">
              ${data.metrics.wrongful_accusations.pass ? '✓' : '✖'} Wrongful Accusations: ${data.metrics.wrongful_accusations.current} (Max Allowed: ${data.metrics.wrongful_accusations.max_allowed})
            </div>
          </div>

          <button class="btn-dci" style="width:100%; justify-content:center; padding:12px;" onclick="closeModal('modal-promotion-review')">RETURN TO ASSIGNMENTS & IMPROVE PERFORMANCE</button>
        </div>
      `;
    }

    modal.classList.add('active');
  }

  async executePromotion() {
    const res = await window.dciApi.applyPromotion();
    if (res.new_rank) {
      if (window.audioEngine) window.audioEngine.playStamp();
      closeModal('modal-promotion-review');
      alert(`PROMOTION OFFICIAL! You are now a ${res.new_rank} (Clearance Level 0${res.new_clearance_level}).`);
      location.reload();
    } else {
      alert(res.error || "Failed to execute promotion.");
    }
  }

  async simulateTestCase() {
    const outcome = prompt("Select Test Outcome:\n[1] SUCCESSFUL\n[2] PERFECT\n[3] FAILED\n[4] WRONGFUL_ACCUSATION", "1");
    let out = "SUCCESSFUL";
    if (outcome === "2") out = "PERFECT";
    if (outcome === "3") out = "FAILED";
    if (outcome === "4") out = "WRONGFUL_ACCUSATION";

    const res = await window.dciApi.completeTestCase(out, 90);
    if (res.cases_completed_count !== undefined) {
      alert(`TEST CASE COMPLETED (${out}). Total completed cases: ${res.cases_completed_count}`);
      location.reload();
    }
  }
}

window.promotionEngine = new PromotionEngine();
