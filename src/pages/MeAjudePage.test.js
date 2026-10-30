import React from 'react';
import {render,screen} from '@testing-library/react';
import MeAjudePage from './MeAjudePage';

test('ajuda descreve corretamente dados na nuvem e no navegador, sem promessas absolutas',()=>{
  render(<MeAjudePage/>);
  expect(screen.getByRole('heading',{name:/PRECISA DE AJUDA/i})).toBeInTheDocument();
  expect(screen.getByText(/conta no servidor/i)).toBeInTheDocument();
  expect(screen.getByText(/neste navegador/i)).toBeInTheDocument();
  expect(screen.queryByText(/100% privados/i)).not.toBeInTheDocument();
  expect(screen.getByRole('link',{name:/WhatsApp/i})).toHaveAttribute('href',expect.stringContaining('https://wa.me/'));
});