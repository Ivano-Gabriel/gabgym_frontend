import React from 'react';
export default function OnboardingBodyMap({selected=[],back=false}){
 const tone=key=>selected.includes('whole')||selected.includes(key)?'#e34853':'#3e4248';
 const shape=(key,d)=><path d={d} fill={tone(key)} stroke="#121316" strokeWidth="2" strokeLinejoin="round"/>;
 return <svg viewBox="0 0 140 265" className="gg-wizard-body-map" aria-hidden="true">
 <ellipse cx="70" cy="20" rx="13" ry="17" fill="#62666a"/>
 <path d="M61 34h18l4 13H57Z" fill="#62666a"/>
 {shape('shoulders','M57 45 42 47 30 60 34 76 49 70 57 59Z M83 45 98 47 110 60 106 76 91 70 83 59Z')}
 {shape('arms','M34 76 49 70 41 106 26 135 17 132 26 99Z M106 76 91 70 99 106 114 135 123 132 114 99Z')}
 {shape(back?'back':'chest','M57 45 70 48 83 45 95 68 85 85 70 88 55 85 45 68Z')}
 {shape(back?'back':'core','M55 85 70 88 85 85 89 111 81 130H59L51 111Z')}
 {shape('glutes','M59 130 81 130 94 147 85 164H55L46 147Z')}
 {shape('legs','M46 147 68 163 64 211 57 250H43L46 210 39 173Z M94 147 72 163 76 211 83 250H97L94 210 101 173Z')}
 <path d="M43 250h14v9H34v-4Z M83 250h14l9 5v4H83Z" fill="#62666a"/>
 </svg>;
}
