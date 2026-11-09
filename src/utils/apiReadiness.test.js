import {waitForApiReady,isTemporaryApiFailure} from './apiReadiness';

test('reconsulta apenas GET público quando Render responde 504 e depois acorda',async()=>{
 const probe=jest.fn().mockRejectedValueOnce({response:{status:504}})
   .mockRejectedValueOnce(new Error('rede indisponível'))
   .mockResolvedValueOnce({status:'ok'});
 const delay=jest.fn().mockResolvedValue();
 const onAttempt=jest.fn();
 expect(await waitForApiReady({probe,delay,onAttempt,maxAttempts:5})).toBe(true);
 expect(probe).toHaveBeenCalledTimes(3);
 expect(onAttempt).toHaveBeenNthCalledWith(3,3);
 expect(delay).toHaveBeenCalledTimes(2);
});
test('não esconde 403 ou 404 como aquecimento infinito',async()=>{
 for(const status of [401,403,404]){
  expect(isTemporaryApiFailure({response:{status}})).toBe(false);
  const probe=jest.fn().mockRejectedValue({response:{status}});
  expect(await waitForApiReady({probe,maxAttempts:10,delay:()=>Promise.resolve()})).toBe(false);
  expect(probe).toHaveBeenCalledTimes(1);
 }
});
test('para após limite e respeita cancelamento ao mudar de página',async()=>{
 const probe=jest.fn().mockRejectedValue({response:{status:502}});
 expect(await waitForApiReady({probe,maxAttempts:3,delay:()=>Promise.resolve()})).toBe(false);
 expect(probe).toHaveBeenCalledTimes(3);
 const abort=new AbortController();abort.abort();
 expect(await waitForApiReady({probe,signal:abort.signal})).toBe(false);
 expect(probe).toHaveBeenCalledTimes(3);
});
