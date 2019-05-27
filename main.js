$(document).ready(function(){
  // intercetto il click su 'Cerca'
  $('a.search').click(function(){
    cercaFilm();
  });

  // intercetto il tasto invio
  $('.input_search_movie').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      cercaFilm();
    }
  });
});

// per la ricerca di un film
function cercaFilm(){
  // codice da clonare
  var info_film = $('#template_search_film').html();
  // funzione compilatrice
  var template_search_film_function = Handlebars.compile(info_film);

  // prendo il testo dalla casella di input dove l'utente scrive
  var film_cercato = $('.input_search_movie').val();
  // controllo che l'utente abbia scritto qualcosa
  if(film_cercato.length > 0){
    $.ajax({
      url: 'https://api.themoviedb.org/3/search/movie',
      method: 'get',
      data: {
        api_key: '1cd2b33115f891c68dafc6468ce95d73',
        query: film_cercato
      },
      success: function (search_result) {
        console.log(search_result);
        // controllo che ci siano risultati per il film che cerca l'utente
        if(search_result.results.length != 0){
          // oggetto che utilizzerò per popolare l'html
          var context;
          for (var i = 0; i < search_result.results.length; i++) {
            context = {
              Numero_risultato: (i+1) + '° Risultato',
              title: search_result.results[i].title,
              original_title: search_result.results[i].original_title,
              language: search_result.results[i].original_language,
              vote: search_result.results[i].vote_average
            }
            var html = template_search_film_function(context);
            $('.search_results').append(html);
          }
        }else{
          // se l'utente ha inserito un film che non esiste
          alert('Non esistono risultati per il film che hai cercato, riprova')
        }
      },
      error: function (richiesta, stato, errori) {
        alert("E' avvenuto un errore. ");
      }
    });
  } else{
    // se l'utente non ha scritto nulla nella casella input
    alert('Scrivi qualcosa');
  }
  // svuoto il div dei risultati della ricerca
  $('.search_results').empty();
  // 'azzero' il valore dell'input text
  $('.input_search_movie').val('');
}
