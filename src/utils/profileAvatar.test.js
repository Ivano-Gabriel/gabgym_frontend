import { readProfileAvatar, saveProfileAvatar, isSupportedProfileImage } from './profileAvatar';
beforeEach(()=>localStorage.clear());
test('foto do perfil nunca aparece em outra conta no mesmo dispositivo',()=>{
 localStorage.setItem('gabgymAvatar','data:image/png;base64,LEGACY');
 expect(readProfileAvatar(1)).toBe('');
 expect(saveProfileAvatar(1,'data:image/png;base64,ONE')).toBe(true);
 expect(readProfileAvatar(1)).toBe('data:image/png;base64,ONE');
 expect(readProfileAvatar(2)).toBe('');
 expect(saveProfileAvatar(2,'data:image/png;base64,TWO')).toBe(true);
 expect(readProfileAvatar(1)).toBe('data:image/png;base64,ONE');
 expect(readProfileAvatar(2)).toBe('data:image/png;base64,TWO');
});
test('rejeita arquivo grande, SVG ou tipo que não é imagem de perfil',()=>{
 expect(isSupportedProfileImage({type:'image/jpeg',size:100000})).toBe(true);
 expect(isSupportedProfileImage({type:'image/webp',size:100000})).toBe(true);
 expect(isSupportedProfileImage({type:'image/png',size:1500000})).toBe(true);
 expect(isSupportedProfileImage({type:'image/svg+xml',size:100000})).toBe(false);
 expect(isSupportedProfileImage({type:'text/html',size:10})).toBe(false);
 expect(isSupportedProfileImage({type:'image/png',size:1500001})).toBe(false);
});
