import React from 'react';

export default function GraphiqueMentions({ etudiants = [] }) {
  const mentions = {
    'Très Bien': { count: 0, color: '#22c55e' },
    'Bien': { count: 0, color: '#3b82f6' },
    'Assez Bien': { count: 0, color: '#eab308' },
    'Passable': { count: 0, color: '#f97316' },
    'Ajourné': { count: 0, color: '#ef4444' },
  };

  etudiants.forEach((e) => {
    const note = Number(e.note);
    if (note >= 16) mentions['Très Bien'].count++;
    else if (note >= 14) mentions['Bien'].count++;
    else if (note >= 12) mentions['Assez Bien'].count++;
    else if (note >= 10) mentions['Passable'].count++;
    else mentions['Ajourné'].count++;
  });

  const total = etudiants.length;

  if (total === 0) {
    return <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', margin: '30px 0' }}>Aucune donnée à afficher</p>;
  }

  // Calcul des angles pour le Pie Chart SVG
  let cumulativeAngle = 0;
  const slices = Object.entries(mentions)
    .filter(([_, data]) => data.count > 0)
    .map(([key, data]) => {
      const percentage = (data.count / total) * 100;
      const angle = (data.count / total) * 360;
      const startAngle = cumulativeAngle;
      cumulativeAngle += angle;

      const x1 = 100 + 80 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 100 + 80 * Math.sin((Math.PI * startAngle) / 180);
      const x2 = 100 + 80 * Math.cos((Math.PI * (startAngle + angle)) / 180);
      const y2 = 100 + 80 * Math.sin((Math.PI * (startAngle + angle)) / 180);

      const largeArc = angle > 180 ? 1 : 0;
      const pathData = angle === 360 
        ? `M 100 20 A 80 80 0 1 1 99.99 20 Z`
        : `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return { key, ...data, percentage: percentage.toFixed(0), pathData };
    });

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
      {/* Camembert SVG */}
      <svg width="180" height="180" viewBox="0 0 200 200">
        {slices.map((slice, i) => (
          <path key={i} d={slice.pathData} fill={slice.color} stroke="#ffffff" strokeWidth="2" />
        ))}
      </svg>

      {/* Légende */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Object.entries(mentions).map(([label, data]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#0f172a' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: data.color, display: 'inline-block' }}></span>
            <span style={{ fontWeight: '600' }}>{label} :</span>
            <span style={{ color: '#475569' }}>{data.count} ({total > 0 ? Math.round((data.count / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}