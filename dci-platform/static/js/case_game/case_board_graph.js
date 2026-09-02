// OPERATION BLACKWOOD: ADVANCED FULL-SCREEN INTERACTIVE CASE BOARD & POLAROID PINBOARD

class CaseBoardGraph {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.nodes = [];
    this.connections = [];
    this.selectedNode = null;
    this.draggedNode = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isConnecting = false;
    this.connectStartNode = null;
    this.mousePos = { x: 0, y: 0 };
    this.connectMode = false;
    this.initializedLayout = false;

    this.initResize();
    this.initEvents();
  }

  initResize() {
    const resize = () => {
      if (!this.canvas || !this.canvas.parentElement) return;
      this.canvas.width = this.canvas.parentElement.clientWidth || 1200;
      this.canvas.height = this.canvas.parentElement.clientHeight || 800;
      
      if (!this.initializedLayout) {
        this.loadDefaultNodes();
        this.initializedLayout = true;
      }
      this.render();
    };

    window.addEventListener('resize', resize);
    setTimeout(resize, 100);
  }

  loadDefaultNodes() {
    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    const cx = w / 2;
    const cy = h / 2;

    this.nodes = [];
    
    // 1. Victim Node (Exact Center Piece Polaroid)
    this.nodes.push({
      id: "victim",
      label: "LORD PENDELTON",
      subtext: "Victim • Minister of Energy",
      type: "VICTIM",
      x: cx,
      y: cy,
      width: 150,
      height: 105,
      color: "#ef4444",
      icon: "💀",
      status: "DECEASED"
    });

    // 2. Suspect Nodes (Expansive Ring Spanning Full Screen Width & Height)
    const suspectList = [
      { id: "victoria", label: "Lady Victoria", subtext: "Wife of Victim", icon: "👩‍💼", status: "SUSPECT" },
      { id: "finch", label: "Dr. Alistair Finch", subtext: "Personal Physician", icon: "👨‍⚕️", status: "SUSPECT" },
      { id: "vance", label: "Marcus Vance", subtext: "Junior Minister", icon: "💼", status: "PRIME SUSPECT" },
      { id: "reed", label: "Evelyn Reed", subtext: "Private Secretary", icon: "📁", status: "SUSPECT" },
      { id: "sterling", label: "Insp. Sterling", subtext: "Security Chief", icon: "👮‍♂️", status: "SUSPECT" },
      { id: "julian", label: "Julian Thorne", subtext: "Estate Butler", icon: "🤵", status: "WITNESS" },
      { id: "chloe", label: "Chloe Bennett", subtext: "Investigative Journalist", icon: "📸", status: "SUSPECT" },
      { id: "gabriel", label: "Gabriel Moreau", subtext: "French Financial Broker", icon: "💶", status: "SUSPECT" }
    ];

    const rx = Math.max(340, w * 0.38);
    const ry = Math.max(240, h * 0.36);

    suspectList.forEach((s, i) => {
      const angle = (i / suspectList.length) * Math.PI * 2 - Math.PI / 2;
      this.nodes.push({
        id: s.id,
        label: s.label,
        subtext: s.subtext,
        type: "SUSPECT",
        x: cx + Math.cos(angle) * rx,
        y: cy + Math.sin(angle) * ry,
        width: 140,
        height: 95,
        color: "#3b82f6",
        icon: s.icon,
        status: s.status
      });
    });

    this.syncEvidenceNodes();
  }

  syncEvidenceNodes() {
    const discovered = (window.gameEngine && window.gameEngine.state && window.gameEngine.state.discoveredEvidence)
      ? window.gameEngine.state.discoveredEvidence
      : ["EVD-01", "EVD-02", "EVD-03", "EVD-04"];

    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    const cx = w / 2;
    const cy = h / 2;
    const innerRx = (w * 0.38) * 0.55;
    const innerRy = (h * 0.36) * 0.55;

    discovered.forEach((evId, idx) => {
      if (!this.nodes.find(n => n.id === evId)) {
        const evCatalog = typeof CASE_DATA !== 'undefined' ? CASE_DATA.evidenceCatalog : [];
        const evData = evCatalog.find(e => e.id === evId) || { id: evId, name: evId, category: "PHYSICAL", description: "Discovered Evidence Item" };
        
        let icon = "📦";
        if (evData.category === "DIGITAL") icon = "💻";
        else if (evData.category === "FINANCIAL") icon = "💳";
        else if (evData.category === "FORENSIC") icon = "🧪";

        const angle = ((idx + 0.5) / Math.max(1, discovered.length)) * Math.PI * 2;
        this.nodes.push({
          id: evData.id,
          label: evData.name || evData.title || evData.id,
          subtext: `${evData.category || 'EVIDENCE'} • Discovered`,
          type: "EVIDENCE",
          x: cx + Math.cos(angle) * innerRx,
          y: cy + Math.sin(angle) * innerRy,
          width: 130,
          height: 85,
          color: "#f59e0b",
          icon: icon,
          details: evData.description
        });
      }
    });
    this.render();
  }

  addNoteNode() {
    const text = prompt("Enter Case Board Note / Clue Hypothesis:", "Check CCTV time drift vs Lord Arthur's watch");
    if (!text) return;

    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    const noteId = `NOTE-${Date.now()}`;
    
    this.nodes.push({
      id: noteId,
      label: text,
      subtext: "INVESTIGATOR STICKY NOTE",
      type: "NOTE",
      x: (w / 2) + (Math.random() - 0.5) * 300,
      y: (h / 2) + (Math.random() - 0.5) * 200,
      width: 145,
      height: 95,
      color: "#facc15",
      icon: "📌"
    });

    this.render();
    if (window.audioEngine) window.audioEngine.playClick();
  }

  autoArrange() {
    const w = this.canvas.width || 1200;
    const h = this.canvas.height || 800;
    const cx = w / 2;
    const cy = h / 2;

    const victim = this.nodes.find(n => n.type === "VICTIM");
    if (victim) { victim.x = cx; victim.y = cy; }

    const suspects = this.nodes.filter(n => n.type === "SUSPECT");
    const rx = Math.max(320, w * 0.38);
    const ry = Math.max(220, h * 0.36);
    suspects.forEach((s, i) => {
      const angle = (i / suspects.length) * Math.PI * 2 - Math.PI / 2;
      s.x = cx + Math.cos(angle) * rx;
      s.y = cy + Math.sin(angle) * ry;
    });

    const evidences = this.nodes.filter(n => n.type === "EVIDENCE" || n.type === "NOTE");
    const innerRx = rx * 0.55;
    const innerRy = ry * 0.55;
    evidences.forEach((ev, i) => {
      const angle = ((i + 0.5) / Math.max(1, evidences.length)) * Math.PI * 2;
      ev.x = cx + Math.cos(angle) * innerRx;
      ev.y = cy + Math.sin(angle) * innerRy;
    });

    this.render();
    if (window.audioEngine) window.audioEngine.playStamp();
  }

  toggleConnectMode() {
    this.connectMode = !this.connectMode;
    const btn = document.getElementById('btn-connect-mode');
    if (btn) {
      if (this.connectMode) {
        btn.style.background = "var(--accent-red)";
        btn.style.color = "#fff";
        btn.textContent = "🔴 CONNECTING STRINGS (CLICK NODE)";
      } else {
        btn.style.background = "";
        btn.style.color = "";
        btn.textContent = "🔴 CONNECT STRING";
      }
    }
  }

  clearStrings() {
    if (confirm("Clear all red string evidence connections on board?")) {
      this.connections = [];
      this.render();
      this.updateHypothesisScore();
    }
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
    this.canvas.addEventListener('dblclick', (e) => this.onDoubleClick(e));
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  findNodeAt(pos) {
    return this.nodes.find(n => {
      return (
        pos.x >= n.x - n.width / 2 &&
        pos.x <= n.x + n.width / 2 &&
        pos.y >= n.y - n.height / 2 &&
        pos.y <= n.y + n.height / 2
      );
    });
  }

  onMouseDown(e) {
    const pos = this.getMousePos(e);
    const clickedNode = this.findNodeAt(pos);

    if ((e.shiftKey || this.connectMode) && clickedNode) {
      this.isConnecting = true;
      this.connectStartNode = clickedNode;
      this.mousePos = pos;
    } else if (clickedNode) {
      this.draggedNode = clickedNode;
      this.selectedNode = clickedNode;
      this.dragOffset = { x: pos.x - clickedNode.x, y: pos.y - clickedNode.y };
      this.inspectNode(clickedNode);
      if (window.audioEngine) window.audioEngine.playClick();
    } else {
      this.selectedNode = null;
      this.hideInspector();
    }
    this.render();
  }

  onMouseMove(e) {
    const pos = this.getMousePos(e);
    this.mousePos = pos;

    if (this.draggedNode) {
      this.draggedNode.x = pos.x - this.dragOffset.x;
      this.draggedNode.y = pos.y - this.dragOffset.y;
      this.render();
    } else if (this.isConnecting) {
      this.render();
    }

    const hoverNode = this.findNodeAt(pos);
    this.canvas.style.cursor = hoverNode ? 'pointer' : (this.connectMode ? 'crosshair' : 'default');
  }

  onMouseUp(e) {
    const pos = this.getMousePos(e);

    if (this.isConnecting && this.connectStartNode) {
      const targetNode = this.findNodeAt(pos);
      if (targetNode && targetNode.id !== this.connectStartNode.id) {
        const exists = this.connections.find(
          c => (c.from === this.connectStartNode.id && c.to === targetNode.id) ||
               (c.from === targetNode.id && c.to === this.connectStartNode.id)
        );
        if (!exists) {
          const type = prompt("Select Relationship Type:\n[1] MOTIVE  [2] ALIBI CONTRADICTION  [3] FORENSIC MATCH  [4] FINANCIAL LINK  [5] CCTV PLACEMENT", "ALIBI CONTRADICTION");
          this.connections.push({
            from: this.connectStartNode.id,
            to: targetNode.id,
            label: type || "LINK"
          });
          if (window.audioEngine) window.audioEngine.playStamp();
        }
      }
      this.isConnecting = false;
      this.connectStartNode = null;
    }

    this.draggedNode = null;
    this.render();
    this.updateHypothesisScore();
  }

  onDoubleClick(e) {
    const pos = this.getMousePos(e);
    const node = this.findNodeAt(pos);
    if (node) {
      if (node.type === "SUSPECT") {
        switchCaseView('interrogation');
        if (window.interrogationSuite) window.interrogationSuite.selectSuspect(node.id);
      } else if (node.type === "EVIDENCE") {
        switchCaseView('evidence');
      }
    }
  }

  inspectNode(node) {
    const inspector = document.getElementById('board-node-inspector');
    if (!inspector) return;

    let actionsHtml = '';
    if (node.type === "SUSPECT") {
      actionsHtml = `
        <button class="btn-dci primary" style="width:100%; margin-top:14px; font-size:0.8rem; padding:10px;" onclick="switchCaseView('interrogation'); if(window.interrogationSuite) window.interrogationSuite.selectSuspect('${node.id}');">
          🎙️ INTERROGATE ${node.label.toUpperCase()}
        </button>
      `;
    } else if (node.type === "EVIDENCE") {
      actionsHtml = `
        <button class="btn-dci gold" style="width:100%; margin-top:14px; font-size:0.8rem; padding:10px;" onclick="switchCaseView('forensic-lab')">
          🧪 ANALYZE IN FORENSIC LAB
        </button>
      `;
    } else if (node.type === "NOTE") {
      actionsHtml = `
        <button class="btn-dci" style="width:100%; margin-top:14px; font-size:0.8rem; padding:10px; border-color:var(--accent-red); color:var(--accent-red);" onclick="window.caseBoard.deleteNode('${node.id}')">
          🗑️ REMOVE STICKY NOTE
        </button>
      `;
    }

    inspector.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:14px;">
        <span class="badge ${node.color === '#ef4444' ? 'red' : node.color === '#f59e0b' ? 'amber' : 'blue'}">${node.type}</span>
        <button class="btn-dci" style="padding:2px 8px; font-size:0.75rem;" onclick="window.caseBoard.hideInspector()">✕</button>
      </div>
      <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
        <span style="font-size:2rem;">${node.icon}</span>
        <div>
          <h3 style="color:#fff; font-size:1.05rem;">${node.label}</h3>
          <span style="font-size:0.75rem; color:var(--text-muted);">${node.subtext || ''}</span>
        </div>
      </div>
      <div style="background:#05080e; border:1px solid var(--border-color); padding:12px; border-radius:4px; font-size:0.8rem; color:var(--text-secondary); line-height:1.5; margin-bottom:14px;">
        ${node.details || 'Double-click this polaroid card to open its dedicated investigation module.'}
      </div>
      ${actionsHtml}
    `;

    inspector.style.display = 'block';
  }

  deleteNode(nodeId) {
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    this.connections = this.connections.filter(c => c.from !== nodeId && c.to !== nodeId);
    this.hideInspector();
    this.render();
  }

  hideInspector() {
    const inspector = document.getElementById('board-node-inspector');
    if (inspector) inspector.style.display = 'none';
  }

  updateHypothesisScore() {
    const scoreElem = document.getElementById('hypothesis-score');
    if (!scoreElem) return;

    const vanceConnections = this.connections.filter(c => c.from === 'vance' || c.to === 'vance');
    const penConnections = this.connections.filter(c => c.from === 'EVD-01' || c.to === 'EVD-01');
    const audioConnections = this.connections.filter(c => c.from === 'EVD-03' || c.to === 'EVD-03');
    
    let confidence = Math.min(100, (vanceConnections.length * 18) + (penConnections.length * 15) + (audioConnections.length * 20));
    scoreElem.textContent = `${confidence}%`;
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Red String Connections (Tactile Red Yarn)
    this.connections.forEach(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from);
      const toNode = this.nodes.find(n => n.id === conn.to);
      if (fromNode && toNode) {
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.strokeStyle = "#dc2626";
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = "rgba(239, 68, 68, 0.6)";
        this.ctx.shadowBlur = 6;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;

        // Relationship Badge
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        this.ctx.fillStyle = "#090e1a";
        this.ctx.fillRect(midX - 40, midY - 10, 80, 20);
        this.ctx.strokeStyle = "#ef4444";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(midX - 40, midY - 10, 80, 20);
        
        this.ctx.font = "9px 'JetBrains Mono'";
        this.ctx.fillStyle = "#f8fafc";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(conn.label.substring(0, 14), midX, midY);
      }
    });

    // Connecting line draft
    if (this.isConnecting && this.connectStartNode) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.connectStartNode.x, this.connectStartNode.y);
      this.ctx.lineTo(this.mousePos.x, this.mousePos.y);
      this.ctx.strokeStyle = "#f59e0b";
      this.ctx.lineWidth = 2.5;
      this.ctx.setLineDash([6, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // 2. Draw Polaroid Dossier Cards & Pushpins
    this.nodes.forEach(node => {
      const isSelected = (node === this.selectedNode);
      const isVictim = (node.type === "VICTIM");
      const isNote = (node.type === "NOTE");

      const halfW = node.width / 2;
      const halfH = node.height / 2;
      const x = node.x - halfW;
      const y = node.y - halfH;

      // Card Drop Shadow
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.fillRect(x + 4, y + 4, node.width, node.height);

      // Card Background
      if (isNote) {
        this.ctx.fillStyle = "#fef08a"; // Yellow Sticky Note
      } else if (isVictim) {
        this.ctx.fillStyle = "#1e1b2e"; // Dark Red Dossier
      } else {
        this.ctx.fillStyle = "#0f172a"; // Polaroid Dark Slate
      }
      this.ctx.fillRect(x, y, node.width, node.height);

      // Card Border
      this.ctx.strokeStyle = isSelected 
        ? "#38bdf8" 
        : (isVictim ? "#ef4444" : (isNote ? "#ca8a04" : "#334155"));
      this.ctx.lineWidth = isSelected ? 2.5 : 1.5;
      this.ctx.strokeRect(x, y, node.width, node.height);

      // Top Colored Accent Bar
      this.ctx.fillStyle = node.color || "#3b82f6";
      this.ctx.fillRect(x, y, node.width, 4);

      // Icon / Photo Box
      this.ctx.font = "16px sans-serif";
      this.ctx.textAlign = "left";
      this.ctx.fillText(node.icon || "📌", x + 8, y + 26);

      // Title & Subtext
      this.ctx.font = "bold 10px 'JetBrains Mono'";
      this.ctx.fillStyle = isNote ? "#1e293b" : "#ffffff";
      this.ctx.textAlign = "left";
      this.ctx.fillText(node.label.substring(0, 14), x + 30, y + 24);

      this.ctx.font = "8px 'Inter'";
      this.ctx.fillStyle = isNote ? "#475569" : "#94a3b8";
      this.ctx.fillText((node.subtext || '').substring(0, 18), x + 8, y + 42);

      // Status Pill
      if (node.status) {
        this.ctx.fillStyle = isVictim ? "rgba(239,68,68,0.2)" : "rgba(59,130,246,0.2)";
        this.ctx.fillRect(x + 8, y + 54, node.width - 16, 18);
        this.ctx.font = "bold 8px 'JetBrains Mono'";
        this.ctx.fillStyle = isVictim ? "#fca5a5" : "#93c5fd";
        this.ctx.textAlign = "center";
        this.ctx.fillText(node.status, node.x, y + 66);
      }

      // Silver Push-Pin Top Center
      this.ctx.beginPath();
      this.ctx.arc(node.x, y + 2, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = isVictim ? "#ef4444" : "#cbd5e1";
      this.ctx.fill();
      this.ctx.strokeStyle = "#000";
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
  }
}

window.CaseBoardGraph = CaseBoardGraph;
