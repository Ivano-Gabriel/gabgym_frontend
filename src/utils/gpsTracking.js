/** GPS tem deriva mesmo parado; só somar segmentos confiáveis. */
const haversine = (a,b) => {
  const rad=Math.PI/180,R=6371000;
  const dLat=(b.coords.latitude-a.coords.latitude)*rad;
  const dLon=(b.coords.longitude-a.coords.longitude)*rad;
  const x=Math.sin(dLat/2)**2+Math.cos(a.coords.latitude*rad)*Math.cos(b.coords.latitude*rad)*Math.sin(dLon/2)**2;
  return 2*R*Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)));
};
export function filterGpsStep(previous,current) {
  if (!previous || !current) return null;
  const a=previous.coords,b=current.coords;
  if (![a?.latitude,a?.longitude,b?.latitude,b?.longitude,a?.accuracy,b?.accuracy].every(Number.isFinite)) return null;
  if(a.accuracy<0 || b.accuracy<0 || a.accuracy>35 || b.accuracy>35) return null;
  const elapsed=(Number(current.timestamp)-Number(previous.timestamp))/1000;
  if (!Number.isFinite(elapsed)||elapsed<=0) return null;
  const meters=haversine(previous,current);
  // Variações cobertas pelo próprio erro de precisão não contam caminhada.
  if(meters<=Math.max(8,a.accuracy+b.accuracy))return null;
  // Pulso impossível para caminhada/corrida/bicicleta: descarta salto.
  if(meters/elapsed>12) return null;
  return meters/1000;
}
