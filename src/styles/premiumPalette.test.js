import { readdirSync, readFileSync, statSync } from 'fs';
import { join, resolve, relative } from 'path';

function stylesInside(folder) {
  return readdirSync(folder).flatMap(name => {
    const full=join(folder,name);
    if(statSync(full).isDirectory()) return stylesInside(full);
    return name.endsWith('.css')?[full]:[];
  });
}

test('paleta GabGym não contém os antigos rosas explícitos em nenhum CSS de src',()=>{
  const root=resolve(__dirname,'..');
  const oldPink=/#(?:ff9299|ed6670|ef6772|f0757e|ff8b93|f1a2a8|ffd1d4|f2b7bb|e77d87|f0a2a9|ff8e97|f0808a|e95361|f7a0a8|fca5ae|ffadb4|fbe0e2)\b/gi;
  const violations=stylesInside(root).flatMap(file => {
    const found=readFileSync(file,'utf8').match(oldPink);
    return found?[relative(root,file)+': '+[...new Set(found)].join(', ')]:[];
  });
  expect(violations).toEqual([]);
});
