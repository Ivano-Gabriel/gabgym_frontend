/** Gestos apenas para as abas principais, preservando inputs e rolagem horizontal. */
export const SWIPE_PAGES=['/','/alimentacao','/treino','/perfil'];
export function getSwipeDestination(path,dx,dy,elapsed){
 const i=SWIPE_PAGES.indexOf(path);
 if(i<0||!Number.isFinite(dx)||!Number.isFinite(dy)||!Number.isFinite(elapsed))return null;
 if(Math.abs(dx)<90||Math.abs(dx)<Math.abs(dy)*1.5||elapsed>1100)return null;
 return SWIPE_PAGES[i+(dx<0?1:-1)]||null;
}
export function shouldIgnoreSwipeOrigin(target,root){
 if(!target||typeof target.closest!=='function')return true;
 if(target.closest('input,textarea,select,[contenteditable="true"],[role="slider"],[data-no-tab-swipe],.gg-daily-navigation,.gg-hub-sheet,.gg-mobile-menu'))return true;
 let node=target;
 while(node&&node!==root){
   if(node.scrollWidth>node.clientWidth+8&&typeof window!=='undefined'&&window.getComputedStyle){
     const overflow=window.getComputedStyle(node).overflowX;
     if(overflow==='auto'||overflow==='scroll')return true;
   }
   node=node.parentElement;
 }
 return false;
}
