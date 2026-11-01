import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import StreakCalendar from './StreakCalendar';
import {getDiaryLogs} from '../services/apiService';
jest.mock('../services/apiService',()=>({getDiaryLogs:jest.fn()}));
beforeEach(()=>jest.clearAllMocks());
test('foguinho abre semana e só marca dias com registros',async()=>{
 getDiaryLogs.mockResolvedValue({data:[]});
 render(<StreakCalendar userId={17} todayLogs={[{type:'food'}]}/>);
 const button=screen.getByRole('button',{name:/dias|constância/i});
 fireEvent.click(button);
 await waitFor(()=>expect(document.querySelectorAll('.gg27-calendar-day')).toHaveLength(7));
 expect(document.querySelectorAll('.gg27-calendar-day.marked')).toHaveLength(1);
});
test('falha na API é desconhecida, não ausência',async()=>{
 getDiaryLogs.mockRejectedValue(new Error('offline'));
 render(<StreakCalendar userId={17}/>);
 fireEvent.click(screen.getByRole('button',{name:/constância/i}));
 await waitFor(()=>expect(document.querySelectorAll('.gg27-calendar-day.unknown')).toHaveLength(7));
});
