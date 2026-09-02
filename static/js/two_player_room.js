// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) TWO-PLAYER ROOM SYSTEM

class TwoPlayerRoom {
  constructor() {
    this.currentRoomCode = null;
    this.pollTimer = null;
  }

  async createRoom(caseId = "DCI-26-001") {
    if (!window.currentDetective) {
      alert("Please login or register as a Detective first.");
      return;
    }

    const res = await window.dciApi.createRoom(caseId, window.currentDetective.detective_id);
    if (res.room_code) {
      this.currentRoomCode = res.room_code;
      this.showRoomModal(res.room_code, true);
      this.startPolling(res.room_code);
    } else {
      alert("Failed to generate room code.");
    }
  }

  async joinRoom() {
    if (!window.currentDetective) {
      alert("Please login or register as a Detective first.");
      return;
    }

    const code = prompt("Enter 7-Character Investigation Room Code (e.g., KLR-4819):", "KLR-");
    if (!code) return;

    const res = await window.dciApi.joinRoom(code.trim().toUpperCase(), window.currentDetective.detective_id);
    if (res.room_code) {
      this.currentRoomCode = res.room_code;
      this.showRoomModal(res.room_code, false);
      this.startPolling(res.room_code);
    } else {
      alert(res.error || "Failed to join room.");
    }
  }

  showRoomModal(code, isHost) {
    const modal = document.getElementById('modal-two-player-room');
    const content = document.getElementById('two-player-room-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="font-family:var(--font-mono); text-align:center; padding:10px;">
        <div class="classified-stamp" style="font-size:1.1rem; margin-bottom:12px;">JOINT INVESTIGATION ROOM</div>
        <h2 style="color:var(--accent-amber); font-size:1.8rem; letter-spacing:2px; margin:10px 0;">ROOM CODE: ${code}</h2>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:16px;">Share this code with your partner detective to join the shared case state.</p>

        <div style="background:#05080e; border:1px solid var(--border-color); padding:16px; border-radius:6px; text-align:left; margin-bottom:20px;">
          <h4 style="color:#fff; font-size:0.85rem; margin-bottom:8px;">CONNECTED INVESTIGATORS:</h4>
          <div id="room-connected-list">
            <div style="color:var(--accent-green); font-size:0.8rem;">● DETECTIVE ${window.currentDetective.callsign} (${isHost ? 'HOST / LEAD' : 'PARTNER'}) — ONLINE</div>
            <div id="partner-status-row" style="color:var(--text-muted); font-size:0.8rem; margin-top:4px;">⏳ WAITING FOR SECOND DETECTIVE TO CONNECT...</div>
          </div>
        </div>

        <button class="btn-dci primary" style="width:100%; justify-content:center; padding:12px;" onclick="twoPlayerRoom.enterSharedCase()">ENTER JOINT CASE INVESTIGATION</button>
      </div>
    `;

    modal.classList.add('active');
  }

  startPolling(code) {
    clearInterval(this.pollTimer);
    this.pollTimer = setInterval(async () => {
      const status = await window.dciApi.getRoomStatus(code);
      if (status && status.partner) {
        const partnerRow = document.getElementById('partner-status-row');
        if (partnerRow) {
          partnerRow.innerHTML = `<span style="color:var(--accent-green);">● PARTNER DETECTIVE CONNECTED (${status.partner}) — ACTIVE IN ROOM</span>`;
        }
      }
    }, 3000);
  }

  enterSharedCase() {
    closeModal('modal-two-player-room');
    launchCaseAssignment("DCI-26-001");
  }
}

window.twoPlayerRoom = new TwoPlayerRoom();
