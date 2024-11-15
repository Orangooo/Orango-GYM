// Aggiorna il numero sopra la palla per rappresentare l'età
document.getElementById("age").addEventListener("input", function () {
  var ageNumber = document.querySelector(".age-number");
  ageNumber.textContent = this.value;
});

document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("btn-submit");

  // Aggiungi un listener per gestire il click sul pulsante "Genera"
  submitButton.addEventListener("click", function () {
    // Ottieni i valori dai campi del modulo
    const eta = parseInt(document.getElementById("age").value);
    const sesso = document.getElementById("gender").value;
    const intensita = document.querySelector(
      'input[name="intensita"]:checked'
    ).value;
    const obiettivo = document.getElementById("goal").value;
    const tipo_di_allenamento = document.getElementById("tipoAll").value;

    // Chiama la funzione per generare la scheda di allenamento con i dati ottenuti
    generaSchedaAllenamento(
      eta,
      sesso.toUpperCase(),
      intensita,
      obiettivo,
      tipo_di_allenamento
    );
  });
});

// Funzione principale per generare le schede di allenamento
function generaSchedaAllenamento(
  eta,
  sesso,
  intensita,
  obiettivo,
  tipo_di_allenamento
) {
  console.log(eta, sesso, intensita, obiettivo);
  // Carica il file JSON degli esercizi
  fetch("es_attrezzi.json")
    .then((response) => response.json())
    .then((data) => {
      // Inizializza schedaAllenamento come un array vuoto
      const schedaAllenamento = [];

      // Filtra gli esercizi in base ai criteri specificati e aggiungili a schedaAllenamento
      data.esercizi.forEach((esercizio) => {
        if (
          esercizio.obiettivo &&
          esercizio.obiettivo.includes(obiettivo) &&
          esercizio.tipo_di_allenamento.includes(tipo_di_allenamento)
        ) {
          schedaAllenamento.push({
            nome: esercizio.nome,
            ripetizioni: calcolaRipetizioni(intensita),
            serie: calcolaSerie(intensita),
            recupero: calcolaRecupero(intensita),
          });
        }
      });

      // Aggiungi o rimuovi esercizi in base all'età e al sesso
      let numeroEsercizi;
      if (eta < 30) {
        numeroEsercizi = 8;
      } else if (eta >= 30 && eta < 40) {
        numeroEsercizi = 6;
      } else if (eta >= 40 && eta < 50) {
        numeroEsercizi = 7;
      } else {
        numeroEsercizi = 5;
      }
      if (sesso === "M") {
        numeroEsercizi += 2;
      } else if (sesso === "F") {
        numeroEsercizi -= 2;
      }

      // Se il numero di esercizi è maggiore di quelli presenti nella scheda, aggiungi esercizi casuali dalla scheda
      while (schedaAllenamento.length < numeroEsercizi) {
        const esercizioCasuale =
          schedaAllenamento[
            Math.floor(Math.random() * schedaAllenamento.length)
          ];
        schedaAllenamento.push(esercizioCasuale);
      }
      schedaAllenamento.splice(numeroEsercizi);

      // Ottieni il riferimento all'elemento tbody della tabella
      const trainingBody = document.getElementById("training-body");

      // Cancella il contenuto attuale della tabella
      trainingBody.innerHTML = "";

      // Aggiungi ogni esercizio alla tabella
      schedaAllenamento.forEach((esercizio) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${esercizio.nome}</td>
                    <td>${esercizio.serie}</td>
                    <td>${esercizio.ripetizioni}</td>
                    <td>${esercizio.recupero}</td>
                `;
        trainingBody.appendChild(row);
      });
    })
    .catch((error) =>
      console.error(
        "Errore durante il recupero dei dati degli esercizi:",
        error
      )
    );
}

// Funzione per calcolare le ripetizioni in base all'intensità dell'allenamento
function calcolaRipetizioni(intensita) {
  switch (intensita) {
    case "Facile":
      return Math.floor(Math.random() * (8 - 6 + 1)) + 6; // Genera un numero casuale tra 6 e 8 inclusi
    case "Intermedio":
      return Math.floor(Math.random() * (12 - 10 + 1)) + 10; // Genera un numero casuale tra 10 e 12 inclusi
    case "Difficile":
      return Math.floor(Math.random() * (16 - 14 + 1)) + 14; // Genera un numero casuale tra 14 e 16 inclusi
    default:
      return 12;
  }
}

// Funzione per calcolare le serie in base all'intensità dell'allenamento
function calcolaSerie(intensita) {
  switch (intensita) {
    case "Facile":
      return 3;
    case "Intermedio":
      return 4;
    case "Difficile":
      return 5;
    default:
      return 4;
  }
}

// Funzione per calcolare il tempo di recupero in base all'intensità dell'allenamento
function calcolaRecupero(intensita) {
  switch (intensita) {
    case "Facile":
      return 90;
    case "Intermedio":
      return 60;
    case "Difficile":
      return 30;
    default:
      return 60;
  }
}

function stampareTabella() {
  var tabella = document.querySelector("table");
  var stampa = window.open();
  stampa.document.write(
    "<html><head><title>Scheda di Allenamento - Orango GYM</title>"
  );
  stampa.document.write("<style>");
  stampa.document.write(
    "table {border-collapse: collapse;width: 100%;margin-bottom: 20px; text-align: center;}"
  );
  stampa.document.write(
    "th, td {border: 1px solid #ddd;padding: 8px;text-align: left; text-align: center;}"
  );
  stampa.document.write("th {background-color: #f2f2f2;}");
  stampa.document.write("p {text-align: right;}");
  stampa.document.write("h1 {text-align: center;}");
  stampa.document.write(
    'body {text-align: center; font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif; padding: 10px;}'
  );
  stampa.document.write("</style></head><body>");
  stampa.document.write(
    '<img src="img/logo_eraser.png" alt="logo" width="100" />'
  );
  stampa.document.write("<h1>Orango GYM</h1>");
  stampa.document.write("<h3>Scheda di Allenamento</h3>");
  stampa.document.write(tabella.outerHTML);
  stampa.document.write("<p><i>La Direzione<i></p>");
  stampa.document.write("</body></html>");
  stampa.document.close();
  stampa.print();
}
