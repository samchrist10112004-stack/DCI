// DIRECTORATE OF CRIMINAL INVESTIGATION (DCI) ORGANIZATIONAL MAIL & DOCUMENT VIEWER ENGINE

class DCIMailEngine {
  constructor() {
    this.activeFolder = "inbox";
    this.activeCaseFilter = "ALL";
    this.searchQuery = "";
    this.selectedMsgId = null;
    this.zoomLevel = 100;
  }

  getInvestigatorIdentity() {
    const profile = (window.dciApi && typeof window.dciApi.getProfile === 'function')
      ? JSON.parse(localStorage.getItem("dci_current_user") || "{}")
      : {};

    const name = profile.display_name || "Alex Morgan";
    const callsign = profile.callsign || "RAVEN-17";
    const id = profile.detective_id || "DCI-26-884912";
    const rank = profile.rank || "CADET DETECTIVE";
    const clearance = profile.clearance_level || 1;
    const division = profile.division || "Criminal Investigation Division";
    
    const namePart = (name || callsign).toLowerCase().replace(/[^a-z0-9]/g, '');
    const idNum = id.replace(/[^0-9]/g, '').slice(-4) || "4721";
    const email = profile.internal_email || `${namePart}.${idNum}@dci.internal`;

    return { name, callsign, id, rank, clearance, division, email };
  }

  getMailList(caseIdFilter = null) {
    const currentCase = caseIdFilter || window.ACTIVE_CASE_ID || "CASE-DCI-002";
    const rawData = window.DCI_MAIL_DATA ? (window.DCI_MAIL_DATA[currentCase] || window.DCI_MAIL_DATA["CASE-DCI-002"] || []) : [];
    
    const userMail = JSON.parse(localStorage.getItem(`dci_user_mail_${currentCase}`) || "null");
    if (!userMail) {
      localStorage.setItem(`dci_user_mail_${currentCase}`, JSON.stringify(rawData));
      return rawData;
    }
    return userMail;
  }

  saveMailList(list, caseIdFilter = null) {
    const currentCase = caseIdFilter || window.ACTIVE_CASE_ID || "CASE-DCI-002";
    localStorage.setItem(`dci_user_mail_${currentCase}`, JSON.stringify(list));
  }

  renderMailbox(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const identity = this.getInvestigatorIdentity();
    const mailList = this.getMailList();
    const unreadCount = mailList.filter(m => !m.isRead && m.category === "inbox").length;

    container.innerHTML = `
      <div class="dci-mail-wrapper" style="display:grid; grid-template-columns:260px 380px 1fr; gap:0; height:680px; background:#05080e; border:1px solid var(--border-color); border-radius:8px; font-family:var(--font-mono); overflow:hidden; box-shadow:0 15px 40px rgba(0,0,0,0.8);">
        
        <!-- SIDEBAR FOLDERS -->
        <aside style="background:#090e1a; border-right:1px solid var(--border-color); padding:16px; display:flex; flex-direction:column; justify-space-between;">
          <div>
            <!-- INVESTIGATOR IDENTITY BADGE -->
            <div style="background:#05080e; border:1px solid var(--border-light); padding:12px; border-radius:6px; margin-bottom:18px;">
              <div style="font-size:0.65rem; color:var(--accent-amber); letter-spacing:1px;">DCI WORKSTATION MAILBOX</div>
              <div style="font-size:0.9rem; font-weight:bold; color:#fff; margin-top:2px;">${identity.name}</div>
              <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">${identity.email}</div>
              <div style="margin-top:8px; display:flex; gap:6px; align-items:center;">
                <span class="badge blue" style="font-size:0.65rem;">${identity.id}</span>
                <span class="badge green" style="font-size:0.65rem;">L-0${identity.clearance}</span>
              </div>
            </div>

            <button class="btn-dci primary" style="width:100%; justify-content:center; padding:10px; font-size:0.8rem; margin-bottom:18px;" onclick="window.dciMail.openComposeModal()">
              ✏️ DISPATCH DEPARTMENTAL MEMO
            </button>

            <!-- FOLDER NAVIGATION -->
            <div style="display:flex; flex-direction:column; gap:4px;">
              <button class="dci-folder-btn ${this.activeFolder === 'inbox' ? 'active' : ''}" onclick="window.dciMail.switchFolder('inbox')">
                <span>📥 Inbox</span>
                ${unreadCount > 0 ? `<span class="badge red">${unreadCount}</span>` : ''}
              </button>
              <button class="dci-folder-btn ${this.activeFolder === 'starred' ? 'active' : ''}" onclick="window.dciMail.switchFolder('starred')">
                <span>⭐ Starred & Evidence</span>
              </button>
              <button class="dci-folder-btn ${this.activeFolder === 'sent' ? 'active' : ''}" onclick="window.dciMail.switchFolder('sent')">
                <span>📤 Sent Communications</span>
              </button>
              <button class="dci-folder-btn ${this.activeFolder === 'case' ? 'active' : ''}" onclick="window.dciMail.switchFolder('case')">
                <span>📂 Case Communications</span>
              </button>
              <button class="dci-folder-btn ${this.activeFolder === 'restricted' ? 'active' : ''}" onclick="window.dciMail.switchFolder('restricted')">
                <span>🔒 Restricted Intelligence</span>
              </button>
              <button class="dci-folder-btn ${this.activeFolder === 'trash' ? 'active' : ''}" onclick="window.dciMail.switchFolder('trash')">
                <span>🗑️ Trash</span>
              </button>
            </div>
          </div>

          <div style="font-size:0.68rem; color:var(--text-muted); border-top:1px solid var(--border-color); padding-top:10px;">
            SYSTEM: DCI MAIL v4.2<br>
            ENCRYPTION: 256-BIT RSA ACTIVE
          </div>
        </aside>

        <!-- MESSAGE LIST COLUMN -->
        <section style="background:#070b14; border-right:1px solid var(--border-color); display:flex; flex-direction:column;">
          <!-- SEARCH BAR & CASE FILTER -->
          <div style="padding:12px; border-bottom:1px solid var(--border-color); background:#090e1a;">
            <input type="text" id="mail-search-input" placeholder="🔍 Search sender, case ID, keyword..." value="${this.searchQuery}" oninput="window.dciMail.handleSearch(this.value)" style="width:100%; background:#05080e; border:1px solid var(--border-light); color:#fff; padding:8px 12px; border-radius:4px; font-size:0.78rem; font-family:var(--font-mono); outline:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; font-size:0.7rem; color:var(--text-muted);">
              <span>FILTER: <strong style="color:var(--accent-amber);">${this.activeFolder.toUpperCase()}</strong></span>
              <span>CASE: <strong style="color:var(--accent-cyan);">${window.ACTIVE_CASE_ID || 'CASE-DCI-002'}</strong></span>
            </div>
          </div>

          <!-- MESSAGES LIST -->
          <div id="mail-message-list-container" style="flex:1; overflow-y:auto; padding:8px;">
            ${this.renderMessageListItems(mailList)}
          </div>
        </section>

        <!-- MESSAGE BODY & READING PANEL -->
        <main style="background:#05080e; padding:20px; overflow-y:auto;" id="mail-reading-pane">
          ${this.renderReadingPane(mailList)}
        </main>
      </div>
    `;
  }

  renderMessageListItems(mailList) {
    let filtered = mailList.filter(m => {
      if (this.activeFolder === "starred") return m.isStarred || m.tag === "evidence" || m.tag === "contradiction";
      if (this.activeFolder === "restricted") return m.clearanceRequired > 1 || m.category === "restricted";
      if (this.activeFolder === "sent") return m.category === "sent";
      if (this.activeFolder === "trash") return m.category === "trash";
      if (this.activeFolder === "case") return m.caseId === (window.ACTIVE_CASE_ID || "CASE-DCI-002");
      return m.category === "inbox";
    });

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.subject.toLowerCase().includes(q) ||
        m.sender.toLowerCase().includes(q) ||
        m.body.toLowerCase().includes(q) ||
        m.caseId.toLowerCase().includes(q) ||
        (m.attachment && m.attachment.fileName.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      return `<div style="color:var(--text-muted); font-size:0.8rem; text-align:center; padding:30px;">NO COMMUNICATIONS FOUND FOR SEARCH / FILTER.</div>`;
    }

    return filtered.map(m => {
      const isSelected = (m.id === this.selectedMsgId);
      const isUnread = !m.isRead;
      return `
        <div class="dci-mail-item ${isSelected ? 'selected' : ''} ${isUnread ? 'unread' : ''}" onclick="window.dciMail.selectMessage('${m.id}')" style="background:${isSelected ? '#0e172a' : isUnread ? '#0a101f' : 'transparent'}; border:1px solid ${isSelected ? 'var(--accent-blue)' : 'var(--border-color)'}; padding:10px 12px; border-radius:6px; margin-bottom:6px; cursor:pointer; transition:all 0.15s ease;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="font-size:0.8rem; color:${isUnread ? '#fff' : 'var(--text-secondary)'};">${m.sender}</strong>
            <span style="font-size:0.68rem; color:var(--text-muted);">${m.timestamp}</span>
          </div>

          <div style="font-size:0.82rem; font-weight:${isUnread ? 'bold' : 'normal'}; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:4px;">
            ${m.subject}
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.7rem;">
            <div style="display:flex; gap:6px; align-items:center;">
              <span class="badge ${m.priority === 'CRITICAL' ? 'red' : m.priority === 'HIGH' ? 'amber' : 'blue'}" style="font-size:0.62rem;">${m.priority}</span>
              <span class="badge blue" style="font-size:0.62rem;">${m.caseId}</span>
            </div>
            <div>
              ${m.attachment ? `<span style="color:var(--accent-amber);" title="Has Attachment">📎</span>` : ''}
              ${m.isStarred ? `<span style="color:var(--accent-gold);" title="Starred">⭐</span>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderReadingPane(mailList) {
    if (!this.selectedMsgId) {
      const first = mailList[0];
      if (first) this.selectedMsgId = first.id;
    }

    const msg = mailList.find(m => m.id === this.selectedMsgId);
    if (!msg) {
      return `<div style="color:var(--text-muted); font-size:0.85rem; text-align:center; margin-top:80px;">SELECT A COMMUNICATION TO REVIEW DOSSIER DETAILS.</div>`;
    }

    const identity = this.getInvestigatorIdentity();
    const isRestricted = (msg.clearanceRequired > identity.clearance);

    return `
      <div>
        <!-- HEADER ACTIONS BAR -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:12px; margin-bottom:16px;">
          <div>
            <span class="badge ${msg.priority === 'CRITICAL' ? 'red' : 'amber'}">${msg.priority} PRIORITY</span>
            <span class="badge blue" style="margin-left:6px;">${msg.caseId}</span>
            ${isRestricted ? `<span class="badge red" style="margin-left:6px;">🔒 CLEARANCE L-0${msg.clearanceRequired} REQUIRED</span>` : ''}
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-dci" style="font-size:0.72rem; padding:4px 10px;" onclick="window.dciMail.toggleStar('${msg.id}')">
              ${msg.isStarred ? '⭐ UNSTAR' : '⭐ STAR EVIDENCE'}
            </button>
            <button class="btn-dci primary" style="font-size:0.72rem; padding:4px 10px;" onclick="window.dciMail.openReplyModal('${msg.id}')">
              💬 REPLY / DISPATCH DIRECTIVE
            </button>
          </div>
        </div>

        <!-- SENDER & RECIPIENT METADATA -->
        <div style="background:#090e1a; border:1px solid var(--border-color); padding:14px; border-radius:6px; margin-bottom:18px;">
          <h2 style="font-size:1.15rem; color:#fff; margin-bottom:8px;">${msg.subject}</h2>
          <div style="font-size:0.78rem; color:var(--text-secondary); line-height:1.6;">
            <div>FROM: <strong style="color:#fff;">${msg.sender}</strong> &lt;${msg.senderAddress}&gt; (${msg.senderDept})</div>
            <div>TO: <strong style="color:#fff;">${identity.name}</strong> &lt;${identity.email}&gt;</div>
            <div>TIMESTAMP: <span style="color:var(--accent-amber);">${msg.timestamp}</span> | GAME CLOCK: ${msg.gameTime}H REMAINING</div>
          </div>
        </div>

        <!-- ATTACHMENT CARD IF PRESENT -->
        ${msg.attachment ? `
          <div style="background:#091224; border:1px solid var(--accent-blue); padding:12px; border-radius:6px; margin-bottom:18px; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:12px;">
              <span style="font-size:2rem; color:var(--accent-cyan);">📄</span>
              <div>
                <strong style="font-size:0.85rem; color:#fff; display:block;">${msg.attachment.fileName}</strong>
                <span style="font-size:0.72rem; color:var(--text-muted);">${msg.attachment.fileType} • ${msg.attachment.fileSize}</span>
              </div>
            </div>
            <button class="btn-dci primary" style="font-size:0.75rem; padding:8px 14px;" onclick="window.dciMail.openAttachmentViewer('${msg.attachment.id}')">
              👁️ OPEN IN DOCUMENT READER
            </button>
          </div>
        ` : ''}

        <!-- BODY CONTENT -->
        <div style="font-size:0.88rem; color:var(--text-primary); line-height:1.7; background:#05080e; border:1px solid var(--border-color); padding:18px; border-radius:6px; margin-bottom:18px; white-space:pre-wrap;">
          ${isRestricted ? `
            <div style="color:var(--accent-red); font-family:var(--font-mono); text-align:center; padding:30px; border:1px dashed var(--accent-red);">
              🔒 SECURITY CLEARANCE ACCESS RESTRICTED<br><br>
              This departmental communication requires CLEARANCE LEVEL 0${msg.clearanceRequired}.<br>
              Your active credential rank is LEVEL 0${identity.clearance}.<br><br>
              Solve investigations and advance detective rank to unlock restricted intelligence.
            </div>
          ` : msg.body}
        </div>

        <!-- PRIVATE INVESTIGATOR NOTES EDITOR -->
        <div style="background:#090e1a; border:1px solid var(--border-color); padding:14px; border-radius:6px;">
          <div style="font-size:0.75rem; color:var(--accent-amber); font-weight:bold; margin-bottom:6px;">📝 PRIVATE INVESTIGATOR CONTRADICTION & EVIDENCE NOTES:</div>
          <textarea id="mail-notes-textarea" rows="2" placeholder="Record contradictions, timeline notes, or evidence links here..." style="width:100%; background:#05080e; border:1px solid var(--border-light); color:#fff; padding:8px; border-radius:4px; font-family:var(--font-mono); font-size:0.78rem;" onchange="window.dciMail.saveNotes('${msg.id}', this.value)">${msg.notes || ''}</textarea>
        </div>
      </div>
    `;
  }

  selectMessage(msgId) {
    this.selectedMsgId = msgId;
    const mailList = this.getMailList();
    const msg = mailList.find(m => m.id === msgId);
    if (msg && !msg.isRead) {
      msg.isRead = true;
      this.saveMailList(mailList);
    }
    if (window.audioEngine) window.audioEngine.playClick();
    this.renderMailbox('hq-tab-mail-container');
  }

  switchFolder(folder) {
    this.activeFolder = folder;
    if (window.audioEngine) window.audioEngine.playClick();
    this.renderMailbox('hq-tab-mail-container');
  }

  handleSearch(query) {
    this.searchQuery = query;
    const mailList = this.getMailList();
    const container = document.getElementById('mail-message-list-container');
    if (container) {
      container.innerHTML = this.renderMessageListItems(mailList);
    }
  }

  toggleStar(msgId) {
    const mailList = this.getMailList();
    const msg = mailList.find(m => m.id === msgId);
    if (msg) {
      msg.isStarred = !msg.isStarred;
      this.saveMailList(mailList);
      this.renderMailbox('hq-tab-mail-container');
    }
  }

  saveNotes(msgId, notesText) {
    const mailList = this.getMailList();
    const msg = mailList.find(m => m.id === msgId);
    if (msg) {
      msg.notes = notesText;
      this.saveMailList(mailList);
    }
  }

  // DOCUMENT READER MODAL WITH ZOOM & SEARCH
  openAttachmentViewer(attachmentId) {
    const mailList = this.getMailList();
    let foundAtt = null;
    mailList.forEach(m => {
      if (m.attachment && m.attachment.id === attachmentId) {
        foundAtt = m.attachment;
      }
    });

    if (!foundAtt) return;

    let modal = document.getElementById('modal-dci-document-reader');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-dci-document-reader';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card" style="width:820px; max-height:85vh; background:#070b14; border:2px solid var(--accent-cyan); box-shadow:0 0 50px rgba(6,182,212,0.3);">
        <div class="modal-header" style="background:#090e1a; border-bottom:1px solid var(--accent-cyan);">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.2rem; color:var(--accent-cyan);">📄</span>
            <div>
              <span style="font-size:0.85rem; font-weight:bold; color:#fff;">DCI DOCUMENT READER — ${foundAtt.fileName}</span>
              <span style="font-size:0.7rem; color:var(--text-muted); display:block;">${foundAtt.fileType} • ${foundAtt.fileSize}</span>
            </div>
          </div>
          <button class="btn-dci" onclick="document.getElementById('modal-dci-document-reader').classList.remove('active')">✕ CLOSE</button>
        </div>

        <div style="padding:10px 16px; background:#05080e; border-bottom:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; gap:8px;">
            <button class="btn-dci" style="font-size:0.72rem; padding:4px 8px;" onclick="window.dciMail.adjustZoom(10)">➕ ZOOM IN</button>
            <button class="btn-dci" style="font-size:0.72rem; padding:4px 8px;" onclick="window.dciMail.adjustZoom(-10)">➖ ZOOM OUT</button>
            <button class="btn-dci" style="font-size:0.72rem; padding:4px 8px;" onclick="window.dciMail.adjustZoom(0)">RESET</button>
          </div>
          <button class="btn-dci primary" style="font-size:0.75rem; padding:6px 12px;" onclick="alert('DOCUMENT DOWNLOADED TO IN-GAME CASE LOCKER.')">
            📥 DOWNLOAD TO INVESTIGATION FILE
          </button>
        </div>

        <div class="modal-body" id="doc-viewer-content" style="padding:20px; overflow-y:auto; max-height:60vh;">
          <div id="doc-zoom-wrapper" style="transform-origin:top left; transition:transform 0.15s ease;">
            ${foundAtt.contentHtml}
          </div>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.audioEngine) window.audioEngine.playStamp();
  }

  adjustZoom(delta) {
    if (delta === 0) this.zoomLevel = 100;
    else this.zoomLevel = Math.max(70, Math.min(150, this.zoomLevel + delta));

    const elem = document.getElementById('doc-zoom-wrapper');
    if (elem) {
      elem.style.transform = `scale(${this.zoomLevel / 100})`;
    }
  }

  openReplyModal(msgId) {
    const mailList = this.getMailList();
    const msg = mailList.find(m => m.id === msgId);
    if (!msg) return;

    let modal = document.getElementById('modal-dci-reply');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-dci-reply';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-card" style="width:580px;">
        <div class="modal-header">
          <span>DISPATCH DEPARTMENTAL DIRECTIVE / REPLY</span>
          <button class="btn-dci" onclick="document.getElementById('modal-dci-reply').classList.remove('active')">✕</button>
        </div>
        <div class="modal-body">
          <form onsubmit="window.dciMail.submitReply(event, '${msg.id}')">
            <div class="form-group">
              <label>RECIPIENT DEPARTMENT</label>
              <input type="text" value="${msg.sender} <${msg.senderAddress}>" readonly style="background:#05080e;">
            </div>
            <div class="form-group">
              <label>SUBJECT</label>
              <input type="text" value="RE: ${msg.subject}" readonly style="background:#05080e;">
            </div>
            <div class="form-group">
              <label>TACTICAL INVESTIGATION REQUEST PRESETS</label>
              <select id="reply-preset-select" onchange="document.getElementById('reply-body-text').value = this.value">
                <option value="">-- Select Preset Departmental Request --</option>
                <option value="Requesting expedited toxicology chromatography analysis on evidence sample.">Request Expedited Toxicology Analysis (-1 Game Hr)</option>
                <option value="Requesting Wi-Fi MAC telemetry packet trace for secondary mobile devices.">Request Wi-Fi MAC Telemetry Trace (-1 Game Hr)</option>
                <option value="Requesting full forensic fingerprint comparison on study deadbolt.">Request Fingerprint Comparison Audit (-1 Game Hr)</option>
                <option value="Requesting offshore wire audit on board trustee accounts.">Request Financial Offshore Audit (-1 Game Hr)</option>
              </select>
            </div>
            <div class="form-group">
              <label>DIRECTIVE MESSAGE / INQUIRY BODY</label>
              <textarea id="reply-body-text" rows="4" placeholder="Enter instructions or requests for the department..." required></textarea>
            </div>
            <button type="submit" class="btn-dci primary" style="width:100%; justify-content:center; padding:12px; margin-top:10px;">
              📤 DISPATCH DIRECTIVE (-1 GAME HR)
            </button>
          </form>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  submitReply(e, origMsgId) {
    e.preventDefault();
    const replyBody = document.getElementById('reply-body-text').value.trim();
    if (!replyBody) return;

    const mailList = this.getMailList();
    const origMsg = mailList.find(m => m.id === origMsgId);
    if (!origMsg) return;

    const identity = this.getInvestigatorIdentity();
    const newMsg = {
      id: `MSG-REPLY-${Date.now()}`,
      threadId: origMsg.threadId,
      caseId: origMsg.caseId,
      sender: identity.name,
      senderAddress: identity.email,
      senderDept: identity.division,
      recipient: origMsg.sender,
      recipientAddress: origMsg.senderAddress,
      subject: `RE: ${origMsg.subject}`,
      timestamp: "Just now",
      gameTime: (window.gameEngine && window.gameEngine.state) ? window.gameEngine.state.timeRemaining : 48,
      priority: "HIGH",
      clearanceRequired: 1,
      isRead: true,
      isStarred: false,
      category: "sent",
      tag: "evidence",
      notes: "",
      body: replyBody,
      attachment: null
    };

    mailList.push(newMsg);
    this.saveMailList(mailList);

    if (window.gameEngine && window.gameEngine.consumeTime) {
      window.gameEngine.consumeTime(1, "Dispatch Departmental Directive");
    }
    if (window.audioEngine) window.audioEngine.playStamp();

    document.getElementById('modal-dci-reply').classList.remove('active');
    alert("DIRECTIVE DISPATCHED: Departmental inquiry dispatched successfully (-1 Game Hr).");
    this.renderMailbox('hq-tab-mail-container');
  }

  openComposeModal() {
    let modal = document.getElementById('modal-dci-compose');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-dci-compose';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const currentCase = window.ACTIVE_CASE_ID || "CASE-DCI-002";

    modal.innerHTML = `
      <div class="modal-card" style="width:620px;">
        <div class="modal-header" style="border-bottom:1px solid var(--accent-red);">
          <span style="color:var(--accent-red); font-weight:bold;">✏️ DISPATCH DEPARTMENTAL MEMO</span>
          <button class="btn-dci" onclick="document.getElementById('modal-dci-compose').classList.remove('active')">✕</button>
        </div>
        <div class="modal-body">
          <form onsubmit="window.dciMail.submitComposeMemo(event)">
            <div class="form-group">
              <label>DESTINATION DCI DEPARTMENT</label>
              <select id="compose-dept-select" required>
                <option value="Forensic Sciences Division|forensics@dci.internal">Forensic Sciences Division (forensics@dci.internal)</option>
                <option value="Cyber Intelligence Unit|cyber@dci.internal">Cyber Intelligence Unit (cyber@dci.internal)</option>
                <option value="Financial Intelligence Unit|financial@dci.internal">Financial Intelligence Unit (financial@dci.internal)</option>
                <option value="Field Investigation Unit|fieldunit@dci.internal">Field Investigation Unit (fieldunit@dci.internal)</option>
                <option value="Directorate Command|director@dci.internal">Directorate Command (director@dci.internal)</option>
              </select>
            </div>
            <div class="form-group">
              <label>CASE IDENTIFIER</label>
              <input type="text" id="compose-case-id" value="${currentCase}" readonly style="background:#05080e;">
            </div>
            <div class="form-group">
              <label>PRIORITY LEVEL</label>
              <select id="compose-priority">
                <option value="NORMAL">NORMAL PRIORITY</option>
                <option value="HIGH" selected>HIGH PRIORITY</option>
                <option value="CRITICAL">CRITICAL URGENCY</option>
              </select>
            </div>
            <div class="form-group">
              <label>MEMO SUBJECT</label>
              <input type="text" id="compose-subject" placeholder="e.g. Urgent Request for Expedited Fingerprint Audit #STJ-042" required>
            </div>
            <div class="form-group">
              <label>TACTICAL DIRECTIVE PRESET SELECTOR</label>
              <select onchange="if(this.value) document.getElementById('compose-body').value = this.value">
                <option value="">-- Select Preset Departmental Directive --</option>
                <option value="Requesting expedited laboratory toxicology analysis on recovered evidence sample. Please compare against organophosphate database.">Request Expedited Toxicology Analysis (-1 Game Hr)</option>
                <option value="Requesting Wi-Fi router packet log trace for secondary mobile devices active during incident window.">Request Wi-Fi MAC Telemetry Trace (-1 Game Hr)</option>
                <option value="Requesting full forensic fingerprint comparison on study deadbolt & keypad surfaces.">Request Fingerprint Comparison Audit (-1 Game Hr)</option>
                <option value="Requesting offshore wire audit on board trustee accounts and endowment slush funds.">Request Financial Offshore Audit (-1 Game Hr)</option>
              </select>
            </div>
            <div class="form-group">
              <label>MEMO BODY / INVESTIGATIVE DIRECTIVE DETAILS</label>
              <textarea id="compose-body" rows="4" placeholder="Type tactical directive or inquiry details for the department..." required></textarea>
            </div>
            <button type="submit" class="btn-dci primary" style="width:100%; justify-content:center; padding:12px; margin-top:10px;">
              📤 DISPATCH MEMO TO DEPARTMENT (-1 GAME HR)
            </button>
          </form>
        </div>
      </div>
    `;

    modal.classList.add('active');
    if (window.audioEngine) window.audioEngine.playClick();
  }

  submitComposeMemo(e) {
    e.preventDefault();
    const deptVal = document.getElementById('compose-dept-select').value;
    const [deptName, deptAddr] = deptVal.split('|');
    const caseId = document.getElementById('compose-case-id').value;
    const priority = document.getElementById('compose-priority').value;
    const subject = document.getElementById('compose-subject').value.trim();
    const body = document.getElementById('compose-body').value.trim();

    if (!subject || !body) return;

    const identity = this.getInvestigatorIdentity();
    const mailList = this.getMailList(caseId);

    const memoId = `MSG-MEMO-${Date.now()}`;
    const sentMsg = {
      id: memoId,
      threadId: `TH-${Date.now()}`,
      caseId: caseId,
      sender: identity.name,
      senderAddress: identity.email,
      senderDept: identity.division,
      recipient: deptName,
      recipientAddress: deptAddr,
      subject: subject,
      timestamp: "Just now",
      gameTime: (window.gameEngine && window.gameEngine.state) ? window.gameEngine.state.timeRemaining : 48,
      priority: priority,
      clearanceRequired: 1,
      isRead: true,
      isStarred: false,
      category: "sent",
      tag: "evidence",
      notes: "",
      body: body,
      attachment: null
    };

    mailList.push(sentMsg);

    const replyMsg = {
      id: `MSG-REPLY-${Date.now() + 1}`,
      threadId: sentMsg.threadId,
      caseId: caseId,
      sender: deptName,
      senderAddress: deptAddr,
      senderDept: deptName,
      recipient: identity.name,
      recipientAddress: identity.email,
      subject: `RE: ${subject}`,
      timestamp: "Just now",
      gameTime: (window.gameEngine && window.gameEngine.state) ? Math.max(0, window.gameEngine.state.timeRemaining - 1) : 47,
      priority: priority,
      clearanceRequired: 1,
      isRead: false,
      isStarred: true,
      category: "inbox",
      tag: "evidence",
      notes: "",
      body: `Investigator,\n\nYour memo regarding "${subject}" has been processed by ${deptName}.\n\nLABORATORY SUMMARY:\nExpedited analysis confirmed latent data correlates with primary case timeline. Full laboratory dossier update logged under evidence locker.`,
      attachment: {
        id: `ATT-REPLY-${Date.now()}`,
        fileName: `DCI_${deptName.replace(/\s+/g, '_').toUpperCase()}_RESPONSE.pdf`,
        fileType: "PDF Dossier",
        fileSize: "1.8 MB",
        contentHtml: `
          <div style="font-family:var(--font-mono); color:#fff; padding:20px; background:#070b14; border:1px solid var(--accent-cyan);">
            <div style="border-bottom:1px solid var(--accent-cyan); padding-bottom:10px; margin-bottom:14px;">
              <span class="badge blue">DCI DEPARTMENTAL RESPONSE</span>
              <h3 style="color:var(--accent-cyan); margin-top:4px;">${deptName.toUpperCase()} DISPATCH AUDIT</h3>
            </div>
            <p><strong>INQUIRY REFERENCE:</strong> ${subject}</p>
            <p><strong>DISPATCHING OFFICER:</strong> ${identity.name} (${identity.email})</p>
            <p><strong>STATUS:</strong> PROCESSED AND VERIFIED</p>
          </div>
        `
      }
    };

    mailList.push(replyMsg);
    this.saveMailList(mailList, caseId);

    if (window.gameEngine && window.gameEngine.consumeTime) {
      window.gameEngine.consumeTime(1, `Dispatch Departmental Memo (${deptName})`);
    }
    if (window.audioEngine) window.audioEngine.playStamp();

    document.getElementById('modal-dci-compose').classList.remove('active');
    this.notifyNewMail(replyMsg);
    alert(`DEPARTMENTAL MEMO DISPATCHED: Memo sent to ${deptName}. Department response logged in Inbox (-1 Game Hr).`);
    this.renderMailbox('hq-tab-mail-container');
    this.renderMailbox('view-dci-mail-container');
  }

  notifyNewMail(msg) {
    let toast = document.getElementById('dci-mail-toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dci-mail-toast-notification';
      toast.style.cssText = 'position:fixed; top:20px; right:20px; z-index:9999; background:#090e1a; border:2px solid var(--accent-cyan); border-radius:6px; padding:14px; color:#fff; font-family:var(--font-mono); box-shadow:0 10px 30px rgba(0,0,0,0.8); display:none; max-width:360px;';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div style="font-size:0.7rem; color:var(--accent-cyan); font-weight:bold; letter-spacing:1px;">📧 NEW DCI COMMUNICATION ARRIVED</div>
      <div style="font-size:0.85rem; font-weight:bold; color:#fff; margin-top:4px;">${msg.sender}</div>
      <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:2px;">${msg.subject}</div>
    `;

    toast.style.display = 'block';
    if (window.audioEngine) window.audioEngine.playBeep(800, 0.15);

    setTimeout(() => {
      toast.style.display = 'none';
    }, 4500);
  }
}

window.dciMail = new DCIMailEngine();

