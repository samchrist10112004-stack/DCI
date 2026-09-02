// OPERATION BLACKWOOD & ST. JUDE'S ACADEMY: DYNAMIC MAP & FLOOR PLAN MATRIX

class FloorPlan {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.selectedRoom = null;

    if (window.ACTIVE_CASE_ID === "CASE-DCI-002") {
      this.rooms = [
        { id: "loc-01", name: "Main Gate", x: 40, y: 40, w: 180, h: 100, color: "rgba(59, 130, 246, 0.15)", border: "#3b82f6", items: ["EVD2-19"] },
        { id: "loc-02", name: "Security Office", x: 240, y: 40, w: 200, h: 100, color: "rgba(245, 158, 11, 0.15)", border: "#f59e0b", items: ["EVD2-21", "EVD2-26"] },
        { id: "loc-03", name: "Administrative Wing", x: 460, y: 40, w: 220, h: 100, color: "rgba(239, 68, 68, 0.2)", border: "#ef4444", items: ["EVD2-06", "EVD2-09"] },
        { id: "loc-04", name: "Headmaster's Office", x: 460, y: 160, w: 220, h: 120, color: "rgba(239, 68, 68, 0.3)", border: "#ef4444", items: ["EVD2-01", "EVD2-02", "EVD2-03", "EVD2-04", "EVD2-07", "EVD2-14", "EVD2-25"] },
        { id: "loc-06", name: "Faculty Corridor", x: 240, y: 160, w: 200, h: 120, color: "rgba(100, 116, 139, 0.15)", border: "#64748b", items: ["EVD2-10", "EVD2-20", "EVD2-27"] },
        { id: "loc-07", name: "Senior Dormitory", x: 40, y: 160, w: 180, h: 120, color: "rgba(16, 185, 129, 0.15)", border: "#10b981", items: ["EVD2-08"] },
        { id: "loc-11", name: "Science Block", x: 40, y: 300, w: 220, h: 120, color: "rgba(6, 182, 212, 0.2)", border: "#06b6d4", items: ["EVD2-13", "EVD2-15", "EVD2-18"] },
        { id: "loc-12", name: "Chapel & Cellar", x: 280, y: 300, w: 180, h: 120, color: "rgba(168, 85, 247, 0.2)", border: "#a855f7", items: ["EVD2-05", "EVD2-16", "EVD2-22"] },
        { id: "loc-17", name: "Underground Utility Tunnel", x: 480, y: 300, w: 200, h: 120, color: "rgba(245, 158, 11, 0.25)", border: "#f59e0b", items: ["EVD2-12", "EVD2-28"] },
        { id: "loc-18", name: "Old Archive Room", x: 480, y: 440, w: 200, h: 100, color: "rgba(239, 68, 68, 0.25)", border: "#ef4444", items: ["EVD2-11", "EVD2-29"] },
        { id: "loc-15", name: "Maintenance Building", x: 280, y: 440, w: 180, h: 100, color: "rgba(100, 116, 139, 0.2)", border: "#64748b", items: ["EVD2-24"] },
        { id: "loc-13", name: "Courtyard Quadrangle", x: 40, y: 440, w: 220, h: 100, color: "rgba(34, 197, 94, 0.15)", border: "#22c55e", items: ["EVD2-23"] }
      ];
    } else {
      this.rooms = [
        { id: "study", name: "Lord Arthur's Study", x: 50, y: 50, w: 220, h: 160, color: "rgba(239, 68, 68, 0.25)", border: "#ef4444" },
        { id: "dining", name: "Main Dining Room", x: 300, y: 50, w: 260, h: 160, color: "rgba(59, 130, 246, 0.15)", border: "#3b82f6" },
        { id: "security", name: "Security Control", x: 590, y: 50, w: 160, h: 160, color: "rgba(245, 158, 11, 0.15)", border: "#f59e0b" },
        { id: "conservatory", name: "Conservatory", x: 50, y: 240, w: 220, h: 180, color: "rgba(16, 185, 129, 0.15)", border: "#10b981" },
        { id: "kitchen", name: "Main Kitchen", x: 300, y: 240, w: 260, h: 180, color: "rgba(100, 116, 139, 0.15)", border: "#64748b" },
        { id: "valet_room", name: "Valet Quarters", x: 590, y: 240, w: 160, h: 180, color: "rgba(100, 116, 139, 0.15)", border: "#64748b" },
        { id: "garden", name: "Rear Garden Terrace", x: 50, y: 440, w: 700, h: 100, color: "rgba(34, 197, 94, 0.1)", border: "#22c55e" }
      ];
    }

    this.initResize();
    this.initEvents();
  }

  initResize() {
    const resize = () => {
      if (!this.canvas.parentElement) return;
      this.canvas.width = this.canvas.parentElement.clientWidth;
      this.canvas.height = this.canvas.parentElement.clientHeight;
      this.render();
    };
    window.addEventListener('resize', resize);
    setTimeout(resize, 100);
  }

  initEvents() {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const room = this.rooms.find(r => 
        clickX >= r.x && clickX <= r.x + r.w &&
        clickY >= r.y && clickY <= r.y + r.h
      );

      if (room) {
        this.selectedRoom = room;
        if (window.audioEngine) window.audioEngine.playClick();
        this.render();
        this.updateRoomDetailsPanel(room);
      }
    });
  }

  updateRoomDetailsPanel(room) {
    const panel = document.getElementById('room-details-content');
    if (!panel || typeof window.CASE_DATA === 'undefined') return;

    const caseData = window.CASE_DATA;
    const discoveredIds = (window.gameEngine && window.gameEngine.state) ? window.gameEngine.state.discoveredEvidence : [];
    const itemsInRoom = room.items || [];

    panel.innerHTML = `
      <h3 style="color:#fff; font-size:1.1rem; margin-bottom:6px;">${room.name}</h3>
      <p style="font-size:0.75rem; color:var(--text-muted);">SECTOR CLASSIFICATION: <span class="badge blue">RESTRICTED ACCESS</span></p>
      
      <div style="margin-top:14px;">
        <h4 style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px;">EVIDENCE LOCATED IN SECTOR:</h4>
        ${itemsInRoom.length > 0 ? itemsInRoom.map(evId => {
          const ev = caseData.evidenceCatalog ? caseData.evidenceCatalog.find(e => e.id === evId) : null;
          if (!ev) return '';
          const isCollected = discoveredIds.includes(ev.id);

          return `
            <div style="background:#090d16; padding:10px; border:1px solid ${isCollected ? 'var(--accent-green)' : 'var(--border-color)'}; border-radius:4px; margin-bottom:8px; font-size:0.78rem;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="color:var(--accent-amber);">${ev.id}: ${ev.name}</strong>
                <span class="badge ${isCollected ? 'green' : 'amber'}">${isCollected ? 'COLLECTED & IN LOCKER' : 'UNCOLLECTED'}</span>
              </div>
              <p style="font-size:0.72rem; color:var(--text-secondary); margin-top:4px;">${ev.description}</p>
            </div>
          `;
        }).join('') : '<p style="font-size:0.75rem; color:var(--text-muted);">No uncollected physical evidence detected in this sector.</p>'}
      </div>

      <div style="margin-top:20px;">
        <button class="btn-dci primary" style="width:100%; justify-content:center;" onclick="window.floorPlan.searchRoom('${room.id}')">
          🔍 CONDUCT FORENSIC ROOM SEARCH (-1 HR)
        </button>
      </div>
    `;
  }

  searchRoom(roomId) {
    if (window.gameEngine) {
      window.gameEngine.consumeTime(1, `Room Search: ${roomId}`);
    }
    if (window.audioEngine) window.audioEngine.playStamp();

    const room = this.rooms.find(r => r.id === roomId);
    if (room && room.items && room.items.length > 0) {
      let newlyFound = 0;
      room.items.forEach(evId => {
        if (window.gameEngine && window.gameEngine.discoverEvidence) {
          const wasIn = window.gameEngine.state.discoveredEvidence.includes(evId);
          window.gameEngine.discoverEvidence(evId);
          if (!wasIn) newlyFound++;
        }
      });

      if (typeof renderCaseEvidenceLocker === 'function') {
        renderCaseEvidenceLocker();
      }
      if (window.caseBoard) {
        window.caseBoard.syncEvidenceNodes();
      }

      alert(`FORENSIC SEARCH COMPLETED (-1 GAME HR): Discovered ${room.items.length} evidence item(s) (${newlyFound} new)! All items logged into Evidence Locker & Case Board.`);
    } else {
      alert("FORENSIC SEARCH COMPLETED (-1 GAME HR): No additional hidden physical objects recovered in this sector.");
    }

    if (this.selectedRoom) {
      this.updateRoomDetailsPanel(this.selectedRoom);
    }
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.strokeStyle = "#161c2e";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 40) {
      this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y); this.ctx.stroke();
    }

    this.rooms.forEach(room => {
      this.ctx.fillStyle = room.color;
      this.ctx.fillRect(room.x, room.y, room.w, room.h);

      this.ctx.strokeStyle = (this.selectedRoom === room) ? "#ffffff" : room.border;
      this.ctx.lineWidth = (this.selectedRoom === room) ? 3 : 1.5;
      this.ctx.strokeRect(room.x, room.y, room.w, room.h);

      this.ctx.font = "bold 12px 'JetBrains Mono'";
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillText(room.name, room.x + 10, room.y + 24);
    });
  }
}

window.FloorPlan = FloorPlan;
