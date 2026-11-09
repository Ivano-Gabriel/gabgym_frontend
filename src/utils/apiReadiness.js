/** Read-only health checks are safe to retry. Never retry account creation or a POST. */
export const isTemporaryApiFailure = error => {
  const status=error?.response?.status;
  return status == null || [408,425,429,500,502,503,504].includes(status);
};

export async function waitForApiReady({probe,onAttempt=()=>{},signal,
  maxAttempts=14,intervalMs=4500,delay=ms=>new Promise(resolve=>setTimeout(resolve,ms))}) {
  if(typeof probe!=='function')throw new Error('Sonda de API ausente');
  for(let attempt=1;attempt<=maxAttempts;attempt++){
    if(signal?.aborted)return false;
    onAttempt(attempt);
    try {
      await probe(signal);
      return !signal?.aborted;
    } catch(error) {
      if(signal?.aborted || !isTemporaryApiFailure(error))return false;
      if(attempt<maxAttempts)await delay(intervalMs);
    }
  }
  return false;
}
