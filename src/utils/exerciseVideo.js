import { EXERCISE_LIBRARY } from '../data/workoutDatabase';
/** Apenas arquivos .mp4 publicados em /public/videos_treinos. */
export function resolveExerciseVideo(exercise) {
  const paths=[exercise?.localVideoPath,exercise?.local_video_path,exercise?.localVideo];
  const match=Object.values(EXERCISE_LIBRARY).find(item=>item.name?.trim().toLocaleLowerCase('pt-BR')===exercise?.name?.trim().toLocaleLowerCase('pt-BR'));
  if(match)paths.push(match.localVideo);
  for(const path of paths){
    if(typeof path==='string' && /^\/videos_treinos\/[a-z0-9_-]+\.mp4$/i.test(path))return path;
  }
  return null;
}
