/** Metas educativas calculadas quando o perfil está completo. */
const factors={sedentary:1.2,light:1.375,moderate:1.55,very_active:1.725};
export function suggestDailyGoals(p){
 if(!p||!['male','female'].includes(p.gender)||!Object.prototype.hasOwnProperty.call(factors,p.activityLevel))return null;
 const w=Number(p.weight),h=Number(p.height),a=Number(p.age);
 if(!Number.isFinite(w)||!Number.isFinite(h)||!Number.isFinite(a)||w<20||w>600||h<100||h>250||a<13||a>120)return null;
 if(!['lose-fat','gain-muscle','maintain-weight'].includes(p.objective))return null;
 const maintenance=(10*w+6.25*h-5*a+(p.gender==='male'?5:-161))*factors[p.activityLevel];
 const calories=Math.round(maintenance+(p.objective==='lose-fat'?-350:p.objective==='gain-muscle'?200:0));
 const protein=Math.round(w*1.6),fat=Math.round(w*.75),carbs=Math.round((calories-protein*4-fat*9)/4);
 if(calories<1200||calories>7000||carbs<0)return null;
 return {calories,protein,carbs,fat,water:Math.min(4000,Math.round(w*30/50)*50)};
}
export function goalOrEstimate(custom,estimate,min=1,max=10000){
 const n=Number(custom);
 return custom!==''&&custom!=null&&Number.isFinite(n)&&n>=min&&n<=max?n:
    Number.isFinite(estimate)&&estimate>=min&&estimate<=max?estimate:null;
}
