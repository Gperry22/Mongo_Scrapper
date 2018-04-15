$(document).ready(function () {

  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  getScrapedArticles()

  $("#scrape").on("click", function (event) {
    modalAppearScrape("Scraping Articles...")
    event.preventDefault();
    $.ajax({
      type: "GET",
      url: "/api/scrape",
    }).then(function (scrape) {
      getScrapedArticles();
    });
  });



  function getScrapedArticles() {
    $("#articles").empty();
    $.ajax("/api/articles", { type: "GET" }).then(function (scrape) {
      console.log(scrape);
      if (scrape.length > 0) {
        for (let i = 0; i < scrape.length; i++) {
          let id = scrape[i]._id.toString();
          let title = scrape[i].title;
          let link = scrape[i].link;
          let input = "";
          if (scrape[i].saved == false) {
            input = "<button class='btn btn-danger saveArticle' data-key='" + id + "'>Save Article</button>";
          } else {
            input = "<button class='btn btn-primary' data-key='" + id + "'>Saved</button>";
          }
          $("#articles").append(`                
            <div class="col-md-9 artbg text-center">
              <h5>
              ${title}
              </h5>
              <a href="${link}" target="_blank">${link}</a>
            </div>
            <div class="col-md-3 artbg text-center align-middle">
              ${input}
            </div>                   
          `);
        }
      } else {
        $("#articles").append(`
            <div class="col-md-9 artbg text-center">
              <h2>
                Please Click "Scrape" to add Articles
              </h2>        
        `)
      }
    });
  }



  $("#home").on("click", function (event) {
    event.preventDefault();
    getScrapedArticles();
  });


  $("#savedArts").on("click", function (event) {
    event.preventDefault();
    getSavedArticlesFromDB();
  });


  function getSavedArticlesFromDB() {
    $("#articles").empty();
    $.ajax("/api/savedArticles", {
      type: "GET"
    }).then(function (savedArticles) {
      if (savedArticles.length > 0) {
        for (let i = 0; i < savedArticles.length; i++) {
          let id = savedArticles[i]._id.toString();
          let title = savedArticles[i].title;
          let link = savedArticles[i].link;
          let button = "";
          if (savedArticles[i].notes.length <= 0) {
            button = "<button class='btn btn-success addNote' data-key='" + id + "'> Add Note</button >"
          } else {
            button = "<button class='btn btn-success addNote marbtn1' data-key='" + id + "'> Add Note</button ><button class='btn btn-success viewNote marleft marbtn1' data-key='" + id + "'> View Notes</button >"
          }

          $("#articles").append(`                
              <div class="col-md-9 artbg text-center">
                <h5>
                ${title}
                </h5>
                <a href="${link}" target="_blank">${link}</a>
              </div>
              <div class="col-md-3 artbg text-center align-middle">
              ${button}
                <button class='btn btn-danger removeArticle' data-key='${id}'>Delete Article</button>
              </div>                   
            `);
        }
      } else {
        modalAppear("You do not have any saved Articles.")
        $("#articles").append(`
            <div class="col-md-9 artbg text-center">
              <h2>
                You do not have any saved Articles.
              </h2>        
        `)
      }
    });
  }


  $("#articles").on("click", ".saveArticle", function (event) {
    $("#articles").empty();
    let id = $(this).data("key");
    $.ajax({
      type: "POST",
      url: "/save/" + id,
      data: id
    }).then(function (scrape) {
      modalAppearScrape("Article Saved")
    });
  });



  $("#articles").on("click", ".removeArticle", function (event) {
    $("#articles").empty();
    let id = $(this).data("key");
    $.ajax({
      type: "POST",
      url: "/remove/" + id,
      data: id
    }).then(function (scrape) {
      modalAppearSaved("Saved Article Removed")
    });
  });


  $("#articles").on("click", ".addNote", function (event) {
    $("#articles").empty();
    let id = $(this).data("key");
    console.log(id);
    addNote(id);
  });


  function addNote(id) {
    $("#modalBody").empty();
    modal.style.display = "block";
    $("#modalBody").append(`
      <div id="artId" class="text-center modal-content-head-img-bottom-space2">
      </div>
      <h4 class="text-center">ADD NOTE</h4>
      <div class="text-center">
        <textarea id="notes" class="" type="text"  rows="4" cols="70"/>
      </div>
      <div class="text-center">
        <button id="noteSubmit" class="btn btn-primary" type="submit">Submit Note</button>
        <button id="close"  class="btn btn-danger" type="submit">Cancel</button>
      </div>
      `);

    let passedId = $("#artId");
    passedId.val(id);
  }


  $("#myModal").on("click", "#noteSubmit", function (event) {
    event.preventDefault();
    if ($('#notes').val()) {

      const newNote = $('#notes').val();
      const newId = $('#artId').val();
      $.ajax({
        type: "POST",
        url: "/notes/" + newId,
        data: { body: newNote }
      }).then(function (scrape) {
        modalAppearSaved("Note Added")
      });
    } else {
      modalAppearSaved("Note Not Added due to text box empty.")
    }
  })

  $("#myModal").on("click", "#close", function (event) {
    event.preventDefault();
    modal.style.display = "none";
    getSavedArticlesFromDB()
  })


  $("#articles").on("click", ".viewNote", function (event) {
    $("#modalBody").empty();
    event.preventDefault();
    let id = $(this).data("key");
    $.ajax({
      type: "GET",
      url: "/articles/" + id,
    }).then(function (articleAndNote) {
      console.log(articleAndNote);
      let notes = "<div class='row'></div>"
      for (let i = 0; i < articleAndNote.notes.length; i++) {
        let noteId = articleAndNote.notes[i]._id;
        let artNote = articleAndNote.notes[i].body;
        let count = i + 1
        let artDiv = "<div class='col-md-12 border-bottom marbtn1 colHeight'><h5>" + count + ": " + artNote + " <span><button id='deleteNote'  class='btn btn-danger float-right' type='submit' data-key='" + id + "' data-keyNote='" + noteId + "'>X</button></span></h5></div>"
        notes += artDiv;
      }
      modal.style.display = "block";
      $("#modalBody").append(`
        <div id="artId" class="text-center modal-content-head-img-bottom-space2">
        </div>
        <h2 class="text-center">Notes for Article:</h2>
        <div>
        ${notes}
        </div>
        <div class="text-center">
          <button id="close"  class="btn btn-danger" type="submit">Cancel</button>
        </div>
      `);
    });

  })


  function modalAppearScrape(message) {
    let msg = message;
    modalUp(msg);
    setTimeout(() => {
      getScrapedArticles();
    }, 4000);
  }

  function modalAppearSaved(message) {
    let msg = message;
    modalUp(msg);
    setTimeout(() => {
      getSavedArticlesFromDB();
    }, 4000);
  }

  function modalAppear(message) {
    let msg = message;
    modalUp(msg);
    setTimeout(() => {
      modal.style.display = "none";
    }, 4000);
  }



  function modalUp(msg) {
    $("#modalBody").empty();
    modal.style.display = "block";
    $("#modalBody").append(`
      <div class="text-center modal-content-head-img-bottom-space2">
      </div>
      <h4 class="text-center">${msg}</h4>
      `);
    setTimeout(() => {
      modal.style.display = "none";
    }, 4000);
  }

  $("#myModal").on("click", "#deleteNote", function (event) {
    modalAppearSaved("Feature to be Added Soon!")
    // event.preventDefault();
    // let id = $(this).data("key");
    // let noteId = $(this).data("keyNote");
    //   $.ajax({
    //     type: "DELETE",
    //     url: "/artNoteDelete/" + id + noteId,
    //   }).then(function (scrape) {
    //     modalAppearSaved("Note Deleted!")
    //   });

  })






});



