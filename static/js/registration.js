// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) REGISTRATION & ANIMATED AUTHENTICATION

async function handleRegistrationSubmit(event) {
  event.preventDefault();

  const callsign = document.getElementById('reg-callsign').value.trim().toUpperCase();
  const displayName = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const country = document.getElementById('reg-country').value;
  const style = document.getElementById('reg-style').value;
  const errElem = document.getElementById('reg-error-msg');

  if (errElem) errElem.style.display = 'none';

  const res = await window.dciApi.register({
    callsign,
    display_name: displayName,
    email,
    password,
    country,
    style
  });

  if (res.error) {
    if (errElem) {
      errElem.textContent = res.error;
      errElem.style.display = 'block';
    }
    return;
  }

  // Success -> Show Verification Screen
  closeModal('modal-register');
  showVerificationScreen(res.detective);
}

function showVerificationScreen(detective) {
  const modal = document.getElementById('modal-verification');
  const body = document.getElementById('verification-body');
  if (!modal || !body) return;

  modal.classList.add('active');

  const steps = [
    "PERSONNEL RECORD CREATED...",
    "CREATING BIOMETRIC PROFILE...",
    "CALLSIGN RESERVED: " + detective.callsign,
    "ASSIGNING PERMANENT ID: " + detective.detective_id,
    "CLEARANCE LEVEL ASSIGNED: L-01 (RESTRICTED)",
    "INITIAL RANK: CADET DETECTIVE",
    "STATUS: ACTIVE"
  ];

  body.innerHTML = `
    <div style="font-family:var(--font-mono); text-align:center; padding:20px;">
      <div class="classified-stamp" style="font-size:1.3rem; margin-bottom:16px;">SECURE VERIFICATION IN PROGRESS</div>
      <div id="verif-step-box" style="font-size:0.9rem; color:var(--accent-amber); margin:20px 0; min-height:60px;"></div>
      <div id="verif-complete-box" style="display:none; margin-top:20px;">
        <h3 style="color:var(--accent-green); font-size:1.2rem; margin-bottom:12px;">WELCOME TO THE DIRECTORATE, DETECTIVE ${detective.callsign}.</h3>
        <button class="btn-dci primary" onclick="completeVerificationAndEnterHQ()">ENTER HEADQUARTERS COMMAND</button>
      </div>
    </div>
  `;

  let idx = 0;
  const box = document.getElementById('verif-step-box');
  const interval = setInterval(() => {
    if (idx < steps.length) {
      box.innerHTML += `<div style="margin-bottom:4px;">[${new Date().toLocaleTimeString()}] ${steps[idx]}</div>`;
      idx++;
    } else {
      clearInterval(interval);
      document.getElementById('verif-complete-box').style.display = 'block';
    }
  }, 350);

  window.currentDetective = detective;
}

function completeVerificationAndEnterHQ() {
  closeModal('modal-verification');
  if (window.currentDetective) {
    showHeadquartersDashboard(window.currentDetective);
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const loginId = document.getElementById('login-id').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const errElem = document.getElementById('login-error-msg');
  const formBox = document.getElementById('login-form-content');
  const animBox = document.getElementById('login-anim-content');

  if (errElem) errElem.style.display = 'none';

  const res = await window.dciApi.login({ login_id: loginId, password });
  if (res.error) {
    if (errElem) {
      errElem.textContent = res.error;
      errElem.style.display = 'block';
    }
    return;
  }

  // SUCCESSFUL CREDENTIAL MATCH -> Play Classified High-Tech Login Animation!
  if (formBox && animBox) {
    formBox.style.display = 'none';
    animBox.style.display = 'block';

    const det = res.detective;
    const animSteps = [
      "CONNECTING TO DCI CENTRAL DATABASE...",
      "AUTHENTICATING CREDENTIALS FOR: " + det.callsign,
      "PERMANENT ID MATCHED: " + det.detective_id,
      "CLEARANCE LEVEL 0" + det.clearance_level + " APPROVED"
    ];

    const logContainer = document.getElementById('login-anim-logs');
    logContainer.innerHTML = '';

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < animSteps.length) {
        logContainer.innerHTML += `<div style="color:var(--accent-amber); margin-bottom:4px;">[OK] ${animSteps[idx]}</div>`;
        idx++;
      } else {
        clearInterval(interval);
        document.getElementById('login-anim-stamp').style.display = 'block';
        if (window.audioEngine) window.audioEngine.playStamp();

        setTimeout(() => {
          closeModal('modal-login');
          // Reset login modal UI for next time
          formBox.style.display = 'block';
          animBox.style.display = 'none';
          document.getElementById('login-anim-stamp').style.display = 'none';

          window.currentDetective = det;
          showHeadquartersDashboard(det);
        }, 1200);
      }
    }, 350);
  } else {
    closeModal('modal-login');
    window.currentDetective = res.detective;
    showHeadquartersDashboard(res.detective);
  }
}

function renderDetectiveIDCard(detective, targetElemId) {
  const container = document.getElementById(targetElemId);
  if (!container || !detective) return;

  container.innerHTML = `
    <div class="id-card-wrap">
      <div class="id-card-header">
        <div>
          <span style="font-size:0.65rem; color:var(--accent-amber); letter-spacing:1px; display:block;">DIRECTORATE OF CRIMINAL INVESTIGATION</span>
          <span style="font-size:0.9rem; font-weight:bold; color:#fff;">OFFICIAL DETECTIVE BADGE</span>
        </div>
        <span class="badge red">CLEARANCE L-0${detective.clearance_level}</span>
      </div>

      <div class="id-card-body">
        <div class="id-photo-box">🕵️‍♂️</div>
        <div class="id-details">
          <div>
            <div class="id-field-label">DETECTIVE CALLSIGN</div>
            <div class="id-field-value" style="color:var(--accent-amber); font-size:1rem;">${detective.callsign}</div>
          </div>
          <div>
            <div class="id-field-label">FULL NAME</div>
            <div class="id-field-value">${detective.display_name}</div>
          </div>
          <div>
            <div class="id-field-label">PERMANENT ID</div>
            <div class="id-field-value">${detective.detective_id}</div>
          </div>
          <div>
            <div class="id-field-label">RANK & CLEARANCE</div>
            <div class="id-field-value">${detective.rank} (L-0${detective.clearance_level})</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
