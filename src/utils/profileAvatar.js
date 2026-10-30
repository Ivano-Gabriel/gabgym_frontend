// Fotos locais do perfil nunca devem atravessar IDs de contas diferentes.
const avatarKey = userId => userId == null || userId === '' ? null : 'gabgym:avatar:'+String(userId);
export function readProfileAvatar(userId) {
  const key=avatarKey(userId);
  if(!key)return '';
  try{return localStorage.getItem(key)||'';}catch{return '';}
}
export function saveProfileAvatar(userId,photo) {
  const key=avatarKey(userId);
  if(!key || typeof photo!=='string' || !/^data:image\/(png|jpeg|webp);base64,/i.test(photo))return false;
  try{localStorage.setItem(key,photo);return true;}catch{return false;}
}
export function isSupportedProfileImage(file) {
  return !!file && ['image/jpeg','image/png','image/webp'].includes(file.type)
    && Number.isFinite(file.size) && file.size>0 && file.size<=1500000;
}
