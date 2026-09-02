// DCI PLATFORM: DYNAMIC TIMELINE MATRIX ENGINE

class TimelineMatrix {
  constructor() {}

  render() {
    const container = document.getElementById('timeline-matrix-table-container');
    if (!container || typeof window.CASE_DATA === 'undefined' || !window.CASE_DATA.timelineEvents) return;

    let html = `
      <table class="timeline-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Event Description</th>
            <th>Location Sector</th>
            <th>Status / Anomaly Detection</th>
          </tr>
        </thead>
        <tbody>
    `;

    window.CASE_DATA.timelineEvents.forEach(evt => {
      const isAnomaly = evt.anomaly;

      html += `
        <tr class="${isAnomaly ? 'anomaly' : ''}">
          <td style="font-weight:bold; color:var(--accent-amber);">${evt.time}</td>
          <td>${evt.event}</td>
          <td><span class="location-tag confirmed">${evt.location}</span></td>
          <td>
            ${isAnomaly ? `<span class="location-tag disproven">⚠️ CRITICAL TIMELINE ANOMALY</span>` : `<span class="location-tag confirmed">VERIFIED RECORD</span>`}
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }
}

window.timelineMatrix = new TimelineMatrix();
