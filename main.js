$(document).ready(function(){
  var api_url_base = 'https://api.themoviedb.org/3';
  // intercetto il click su 'Cerca'
  $('a.search').click(function(){
    cercaFilm(api_url_base);
  });

  // intercetto il tasto invio
  $('.input_search_movie').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      cercaFilm(api_url_base);
    }
  });
});

// per la ricerca di un film
function cercaFilm(api){
  // codice da clonare
  var info_film = $('#template_search_film').html();
  // funzione compilatrice
  var template_search_film_function = Handlebars.compile(info_film);

  // codice da clonare
  var bandierine = $('#template_bandiere').html();
  // funzione compilatrice
  var template_bandiere_function = Handlebars.compile(bandierine);

  // prendo il testo dalla casella di input dove l'utente scrive
  var film_cercato = $('.input_search_movie').val();
  // controllo che l'utente abbia scritto qualcosa
  if(film_cercato.length > 0){
    $.ajax({
      url: api + '/search/movie',
      method: 'get',
      data: {
        api_key: '1cd2b33115f891c68dafc6468ce95d73',
        query: film_cercato,
        // language: 'it'
      },
      success: function (search_result) {
        console.log(search_result);
        // controllo che ci siano risultati per il film che cerca l'utente
        if(search_result.results.length != 0){
          // oggetto che utilizzerò per popolare l'html
          var handlebars_movie;
          for (var i = 0; i < search_result.results.length; i++) {
            handlebars_movie = {
              // Numero_risultato: (i+1) + '° Risultato',
              id: search_result.results[i].id,
              title: search_result.results[i].title,
              original_title: search_result.results[i].original_title,
              language: search_result.results[i].original_language,
              vote: search_result.results[i].vote_average,
            }
            var html = template_search_film_function(handlebars_movie);
            // appendo al container
            $('.container_results').append(html);

            // funzione per le stelline
            visualizzaStelline(handlebars_movie.id, handlebars_movie.vote);

            // per le bandiere, invece
            // prendo l'h4.language del movie che sto ciclando
            var lingua_movie = $('div.movie[data-id="' + handlebars_movie.id + '"] h4.language');
            // variabile del template_bandiere
            var handlebars_bandiere = {
              bandiera: visualizzaBandiera(handlebars_movie.id, handlebars_movie.language)
            }
            var html2 = template_bandiere_function(handlebars_bandiere);
            // appendo all0h4.language del template_search_film
            lingua_movie.append(html2);
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
  $('.container_results').empty();
  // 'azzero' il valore dell'input text
  $('.input_search_movie').val('');
}

// funzione per arrotondare il voto
function arrotondaVoto(voto){
    var voto_arrotondato = Math.ceil(voto/2);
    return voto_arrotondato;
}

// funzione per visualizzare quante stelline sono colorate
function visualizzaStelline(id, vote){
  // per ogni icone stellina che si riferisce al movie che sto guardando
  $('div.movie[data-id="' + id + '"] .stelline i').each(function(){
    // se il data-number è <= al voto arrotondato
    if($(this).data('number') <= arrotondaVoto(vote)){
      // $(this).parent().siblings().hide();
      // gli aggiungo la classe yellow per colorarlo, altrimenti non lo colorerò
      $(this).addClass('yellow');
    }
  });
}

// funzione per visualizzare la bandiera corrispondente alla lingua
function visualizzaBandiera(id, lingua){
  // prendo l'h4.language del movie che sto ciclando
  var lingua_movie = $('div.movie[data-id="' + id + '"] h4.language');
  switch(lingua){
    case 'en':
      // nascondo la lingua scritta in stringa
      lingua_movie.children('span').hide();
      // ritorno l'immagine
      return 'https://cdn1.iconfinder.com/data/icons/world-flags-circular/1000/Flag_of_United_Kingdom_-_Circle-512.png';
      break;
    case 'it':
      // nascondo la lingua scritta in stringa
      lingua_movie.children('span').hide();
      // ritorno l'immagine
      return 'https://cdn1.iconfinder.com/data/icons/rounded-flat-country-flag-collection-1/2000/it-01.png';
      break;
    case 'fr':
      // nascondo la lingua scritta in stringa
      lingua_movie.children('span').hide();
      // ritorno l'immagine
      return 'https://cdn1.iconfinder.com/data/icons/european-country-flags/83/france-512.png';
      break;
    default:
      return;
  }
}
