import { Movie } from './movie.model'; // Adjust the import based on your file structure

    describe('Movie Interface', () => {
        fit('Frontend_day28_should_create_movie_instance', () => {
          const movie: Movie = {
            id: 101,
            title: 'Inception',
            genre: 'Sci-Fi',
            duration: 148,
            price: 500
          };
      
          expect(movie).toBeTruthy();
          expect(movie.id).toBe(101);
          expect(movie.title).toBe('Inception');
          expect(movie.genre).toBe('Sci-Fi');
          expect(movie.duration).toBe(148);
          expect(movie.price).toBe(500);
        });
});
