import React from 'react';
import {render,screen} from '@testing-library/react';
import PremiumPhoto from './PremiumPhoto';

test('foto responsiva preserva alternativa e não força 4K no celular',()=>{
  render(<PremiumPhoto scene="food" alt="Refeição equilibrada" />);
  const image=screen.getByRole('img',{name:'Refeição equilibrada'});
  expect(image.getAttribute('src')).toMatch(/^https:\/\/images\.unsplash\.com\/photo-/);
  expect(image.getAttribute('srcset')).toContain('3840w');
  expect(image.getAttribute('sizes')).toContain('max-width: 600px');
  expect(image).toHaveAttribute('loading','lazy');
});
test('foto meramente decorativa não polui nome de link e prioridade é opcional',()=>{
  render(<a href="/treino">Treino<PremiumPhoto scene="strength" decorative priority /></a>);
  expect(screen.getByRole('link',{name:'Treino'})).toBeInTheDocument();
  const image=document.querySelector('img.gg-premium-photo');
  expect(image).toHaveAttribute('alt','');
  expect(image).toHaveAttribute('loading','eager');
});
test('cena desconhecida não renderiza elemento quebrado',()=>{
  const {container}=render(<PremiumPhoto scene="unknown" />);
  expect(container.querySelector('img')).toBeNull();
});

test('foto de água e foto de metas usam cenas próprias e carregamento preguiçoso',()=>{
  const {container}=render(<>
    <PremiumPhoto scene="water" decorative />
    <PremiumPhoto scene="goals" decorative />
  </>);
  const [water,goals]=container.querySelectorAll('img.gg-premium-photo');
  expect(water).toHaveAttribute('src',expect.stringContaining('photo-1518837695005-2083093ee35b'));
  expect(goals).toHaveAttribute('src',expect.stringContaining('photo-1517836357463-d25dfeac3438'));
  expect(water).toHaveAttribute('loading','lazy');
  expect(goals.getAttribute('srcset')).toContain('3840w');
});
