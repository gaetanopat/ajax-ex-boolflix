$(document).ready(function(){
  var api_url_base = 'https://api.themoviedb.org/3';
  var img_url = 'https://image.tmdb.org/t/p/';
  var alert_errore = '';

  // intercetto il click su 'Cerca'
  $('a.search').click(function(){
    // prendo il testo dalla casella di input dove l'utente scrive
    var film_cercato = $('.input_search_movie').val();
    // controllo che l'utente abbia scritto qualcosa
    if(film_cercato.length > 0){
      cercaFilm(api_url_base, img_url, film_cercato);
      cercaSerie(api_url_base, img_url, film_cercato);
      // svuoto il div dei risultati della ricerca
      $('.container_results').empty();
      // 'azzero' il valore dell'input text
      $('.input_search_movie').val('');
    }else{
       // se l'utente non ha scritto nulla nella casella input
       alert('Scrivi qualcosa');
     }
  });

  // intercetto il tasto invio
  $('.input_search_movie').keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
      // prendo il testo dalla casella di input dove l'utente scrive
      var film_cercato = $('.input_search_movie').val();
      // controllo che l'utente abbia scritto qualcosa
      if(film_cercato.length > 0){
        cercaFilm(api_url_base, img_url, film_cercato);
        cercaSerie(api_url_base, img_url, film_cercato);
        // svuoto il div dei risultati della ricerca
        $('.container_results').empty();
        // 'azzero' il valore dell'input text
        $('.input_search_movie').val('');
      }else{
         // se l'utente non ha scritto nulla nella casella input
         alert('Scrivi qualcosa');
       }
    }
  });
});

// per la ricerca di un film
function cercaFilm(api, img, film){
  // codice da clonare
  var info_film = $('#template_search_film').html();
  // funzione compilatrice
  var template_search_film_function = Handlebars.compile(info_film);

  $.ajax({
    url: api + '/search/movie',
    method: 'get',
    data: {
      api_key: '1cd2b33115f891c68dafc6468ce95d73',
      query: film,
      // language: 'it'
    },
    success: function (search_result) {
      console.log('film');
      console.log(search_result);
      // controllo che ci siano risultati per il film che cerca l'utente
      if(search_result.results.length > 0){
        // oggetto che utilizzerò per popolare l'html
        var handlebars_movie;
        for (var i = 0; i < search_result.results.length; i++) {
          handlebars_movie = {
            id: search_result.results[i].id,
            image: controlloImmagine(img, search_result.results[i].poster_path),
            type: 'Film',
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
          // funzione per le bandiere
          creaBandiera(handlebars_movie.id, handlebars_movie.language);
          // funzione per il cast dei film
          castFilm(api, handlebars_movie.id);
          // funzione per il genere dei film
          genereFilm(api, search_result.results[i].genre_ids, handlebars_movie.id);
        }
      }else{
        // se l'utente ha inserito un film che non esiste
        alert('Nessun FILM con questo titolo');
      }
    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. ");
    }
  });
}

// per la ricerca di una serie
function cercaSerie(api ,img, film){
  // codice da clonare
  var info_film = $('#template_search_film').html();
  // funzione compilatrice
  var template_search_film_function = Handlebars.compile(info_film);
  $.ajax({
    url: api + '/search/tv',
    method: 'get',
    data: {
      api_key: '1cd2b33115f891c68dafc6468ce95d73',
      query: film,
      // language: 'it'
    },
    success: function (search_result) {
      console.log('serie');
      console.log(search_result);
      // controllo che ci siano risultati per la serie che cerca l'utente
      if(search_result.results.length > 0){
        // oggetto che utilizzerò per popolare l'html
        var handlebars_movie;
        for (var i = 0; i < search_result.results.length; i++) {
          handlebars_movie = {
            id: search_result.results[i].id,
            image: controlloImmagine(img, search_result.results[i].poster_path),
            type: 'Serie Tv',
            title: search_result.results[i].name,
            original_title: search_result.results[i].original_name,
            language: search_result.results[i].original_language,
            vote: search_result.results[i].vote_average,
          }
          var html = template_search_film_function(handlebars_movie);
          // appendo al container
          $('.container_results').append(html);

          // funzione per le stelline
          visualizzaStelline(handlebars_movie.id, handlebars_movie.vote);
          // funzione per le bandiere
          creaBandiera(handlebars_movie.id, handlebars_movie.language);
          // funzione per il cast delle serie
          castSerie(api, handlebars_movie.id);
          // funzione per il genere delle serie
          genereSerie(api, search_result.results[i].genre_ids, handlebars_movie.id);
        }
      }else{
        // se l'utente ha inserito una serie che non esiste
        alert('Nessuna SERIE con questo titolo');
      }
    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. ");
    }
  });
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
      // gli aggiungo la classe yellow per colorarlo, altrimenti non lo colorerò
      $(this).addClass('yellow');
    }
  });
}

// per le bandiere
function creaBandiera(id, lingua){
  // codice da clonare
  var bandierine = $('#template_bandiere').html();
  // funzione compilatrice
  var template_bandiere_function = Handlebars.compile(bandierine);

  // per le bandiere, invece
  // prendo l'h4.language del movie che sto ciclando
  var lingua_movie = $('div.movie[data-id="' + id + '"] h4.language');
  // per ognuno di questi
  lingua_movie.each(function(){
    // se la lingua è 'en', 'fr' o 'it' allora costruisco il template e lo appendo
    if(lingua == 'en' || lingua == 'it' || lingua == 'fr'){
      // variabile del template_bandiere
      var handlebars_bandiere = {
        bandiera: visualizzaBandiera(id, lingua)
      }
      var html2 = template_bandiere_function(handlebars_bandiere);
      // appendo all'h4.language del template_search_film
      lingua_movie.append(html2);
    };
  });
};

// funzione per visualizzare la bandiera corrispondente alla lingua
function visualizzaBandiera(id, lingua){
  // prendo l'h4.language del movie che sto ciclando
  var lingua_movie = $('div.movie[data-id="' + id + '"] h4.language');
  switch(lingua){
    case 'it':
      // nascondo la lingua scritta in stringa
      lingua_movie.children('span').hide();
      // ritorno l'immagine
      return 'img/it.png';
      break;
    case 'fr':
      // nascondo la lingua scritta in stringa
      lingua_movie.children('span').hide();
      // ritorno l'immagine
      return 'img/fr.png';
      break;
    // caso default, 'en'
    default:
      // nascondo la lingua scritta in stringa
      lingua_movie.children('span').hide();
      // ritorno l'immagine
      return 'img/en.png';
  };
}

function controlloImmagine(img, immagine){
  // se l'immagine esiste
  if(immagine != null){
    return img + 'w342' + immagine;
  } else {
    // se non esiste
    return 'img/nofilm.jpg';
  };
};

// per vedere il cast dei film
function castFilm(api, id){
  $.ajax({
    url: api + '/movie/' + id + '/credits',
    method: 'get',
    data: {
      api_key: '1cd2b33115f891c68dafc6468ce95d73',
    },
    success: function (cast) {
      // se ci sono + di 5 attori
      if (cast.cast.length > 5) {
        // mostro solo i primi 5
        for(var i = 0; i < 5; i++){
          // per ogni movie che sto guardando
          $('div.movie[data-id="' + id + '"] .cast').each(function(){
            $(this).append('<h4>' + cast.cast[i].name + '</h4>');
          });
        }
      }
      // se il numero di attori va da 1 a 5 mostro quelli che esistono
      else if (cast.cast.length > 0 && cast.cast.length <= 5){
        for(var i = 0; i < cast.cast.length; i++){
          $('div.movie[data-id="' + id + '"] .cast').each(function(){
            $(this).append('<h4>' + cast.cast[i].name + '</h4>');
          });
        }
      }
      // se non ci sono proprio attori, quindi = 0
      else if (cast.cast.length == 0){
        $('div.movie[data-id="' + id + '"] .cast').each(function(){
          $(this).append('<h4>Non disponibile</h4>');
        });
      }
    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. ");
    }
  });
};

// per vedere il cast delle serie
function castSerie(api, id){
  $.ajax({
    url: api + '/tv/' + id + '/credits',
    method: 'get',
    data: {
      api_key: '1cd2b33115f891c68dafc6468ce95d73',
    },
    success: function (cast) {
      // se ci sono + di 5 attori
      if (cast.cast.length > 5) {
        // mostro solo i primi 5
        for(var i = 0; i < 5; i++){
          // per ogni movie che sto guardando
          $('div.movie[data-id="' + id + '"] .cast').each(function(){
            $(this).append('<h4>' + cast.cast[i].name + '</h4>');
          });
        }
      }
      // se il numero di attori va da 1 a 5 mostro quelli che esistono
      else if (cast.cast.length > 0 && cast.cast.length <= 5){
        for(var i = 0; i < cast.cast.length; i++){
          $('div.movie[data-id="' + id + '"] .cast').each(function(){
            $(this).append('<h4>' + cast.cast[i].name + '</h4>');
          });
        }
      }
      // se non ci sono proprio attori, quindi = 0
      else if (cast.cast.length == 0){
        $('div.movie[data-id="' + id + '"] .cast').each(function(){
          $(this).append('<h4>Non disponibile</h4>');
        });
      }
    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. ");
    }
  });
}

// per i generi dei film
function genereFilm(api, genres, id){
  // array di tutti i generi dei film
  var generiFilm = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science', 'Fiction', 'V Movie', 'Thriller', 'War', 'Western'];
  // array dei generi che corrispondono al film che stiamo guardando
  var generiRecuperati = [];
  // chiamo i generi dei film
  $.ajax({
    url: api + '/genre/movie/list',
    method: 'get',
    data: {
      api_key: '1cd2b33115f891c68dafc6468ce95d73',
    },
    success: function (genre_result) {
      // ciclo più esterno, per tutti i generi esistenti per i film (20 in tutto) da 0 a 19
      for (var i = 0; i < genre_result.genres.length; i++) {
        // ciclo più interno, per i generi del film che stiamo guardando
        for (var j = 0; j < genres.length; j++) {
          // se l'id dei generi dei film in generale == id del genere del film che stiamo guardando
          if(genre_result.genres[i].id == genres[j]){
            // pusho il nome relativo all'id del genere del film che stiamo guardando nell'array generiRecuperati
            generiRecuperati.push(genre_result.genres[i].name);
          }
        }
      }
      console.log(generiRecuperati);
      // ciclo l'array dei generiRecuperati
      for (var l = 0; l < generiRecuperati.length; l++) {
        // se l'array generiFilm contiene il nome del genere nell'array generiRecuperati
        if (generiFilm.includes(generiRecuperati[l])) {
          $('div.movie[data-id="' + id + '"] .generi .msg_errore').hide();
          // lo aggiungo alla scheda
          $('div.movie[data-id="' + id + '"] .generi').append('<h4>' + generiRecuperati[l] + '</h4>');
        }
      }

    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. ");
    }
  });
};

// per i generi delle serie
function genereSerie(api, genres, id){
  // array di tutti i generi delle serie
  var generiSerie = ['Action & Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Kids', 'Mystery', 'News', 'Reality', 'Sci-Fi & Fantasy', 'Soap', 'Talk', 'War & Politics', 'Western'];
  // array dei generi che corrispondono alla serie che stiamo guardando
  var generiRecuperati = [];
  // chiamo i generi delle serie
  $.ajax({
    url: api + '/genre/tv/list',
    method: 'get',
    data: {
      api_key: '1cd2b33115f891c68dafc6468ce95d73',
    },
    success: function (genre_result) {
      // ciclo più esterno, per tutti i generi esistenti per le serie (16 in tutto) da 0 a 15
      for (var i = 0; i < genre_result.genres.length; i++) {
        // ciclo più interno, per i generi della serie che stiamo guardando
        for (var j = 0; j < genres.length; j++) {
          // se l'id dei generi delle serie in generale == id del genere della serie che stiamo guardando
          if(genre_result.genres[i].id == genres[j]){
            // pusho il nome relativo all'id del genere della serie che stiamo guardando nell'array generiRecuperati
            generiRecuperati.push(genre_result.genres[i].name);
          }
        }
      }
      console.log(generiRecuperati);
      // ciclo l'array dei generiRecuperati
      for (var l = 0; l < generiRecuperati.length; l++) {
        // se l'array generiSerie contiene il nome del genere nell'array generiRecuperati
        if (generiSerie.includes(generiRecuperati[l])) {
          $('div.movie[data-id="' + id + '"] .generi .msg_errore').hide();
          // lo aggiungo alla scheda
          $('div.movie[data-id="' + id + '"] .generi').append('<h4>' + generiRecuperati[l] + '</h4>');
        }
      }

    },
    error: function (richiesta, stato, errori) {
      alert("E' avvenuto un errore. ");
    }
  });
};
