import { resolveExerciseVideo } from './exerciseVideo';
test('vídeo de exercício deve ser arquivo público do próprio frontend',()=>{
 expect(resolveExerciseVideo({localVideoPath:'/videos_treinos/supinu.mp4',name:'Supino'})).toBe('/videos_treinos/supinu.mp4');
});
test('não usa localhost, URL externa nem caminhos travessia',()=>{
 expect(resolveExerciseVideo({localVideoPath:'http://127.0.0.1:8000/video.mp4'})).toBe(null);
 expect(resolveExerciseVideo({localVideoPath:'/videos_treinos/../admin.mp4'})).toBe(null);
 expect(resolveExerciseVideo({localVideoPath:'https://untrusted.example/video.mp4'})).toBe(null);
});
test('encontra vídeo pela biblioteca local quando só nome coincide',()=>{
 expect(resolveExerciseVideo({name:'Supino reto com halter',localVideoPath:null})).toBe('/videos_treinos/supinu.mp4');
});