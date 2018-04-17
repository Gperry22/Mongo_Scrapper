$(document).ready(function () {



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
      if (scrape.length > 0) {
        for (let i = 0; i < scrape.length; i++) {
          let id = scrape[i]._id.toString();
          let title = scrape[i].title;
          let link = scrape[i].link;
          let input = "";
          if (scrape[i].saved == false) {
            input = "<button title='Saves Articles' class='btn btn-danger saveArticle' data-key='" + id + "'>Save Article</button>";
          } else {
            input = "<button title='Takes you to Saved Articles' class='btn btn-primary savedBtn' data-key='" + id + "'>Saved</button>";
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
            button = "<button title='Adds A note to this Article' class='btn btn-success addNote' data-key='" + id + "'> Add Note</button >"
          } else {
            button = "<button title='Adds A note to this Article' class='btn btn-success addNote marbtn1' data-key='" + id + "'> Add Note</button ><button title='Views notes for this Article' class='btn btn-success viewNote marleft marbtn1' data-key='" + id + "'> View Notes</button >"
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
                <button title='Removes this Article from your Saved Articles and deletes all associated  Notes but does not delete this article from Scraped Articles' class='btn btn-danger removeArticle' data-key='${id}'>Delete Article</button>
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

  $("#articles").on("click", ".savedBtn", function (event) {
    $("#articles").empty();
    getSavedArticlesFromDB()
  });



  $("#articles").on("click", ".removeArticle", function (event) {
    $("#articles").empty();
    let id = $(this).data("key");
    getArtInfo(id)
  });



  function getArtInfo(passed_id) {
    let id = passed_id;
    $.ajax({
      type: "GET",
      url: "/articles/" + id,
    }).then(function (articleAndNote) {
      for (let i = 0; i < articleAndNote.notes.length; i++) {
        let note = articleAndNote.notes[i]._id;
        $.ajax({
          type: "DELETE",
          url: "/artNoteDelete/" + note,
        }).then(function (scrape) {
        });
      }
      cleanArray(id)
    })
  }


  function cleanArray(id) {
    $.ajax({
      type: "POST",
      url: "/remove/" + id,
    }).then(function (scrape) {
      $("#noteModal").empty();
      modalAppearSaved("All Notes deleted and Save Article Unsaved!")
    });
  }

  $("#articles").on("click", ".addNote", function (event) {
    $("#articles").empty();
    let id = $(this).data("key");
    addNote(id);
  });


  function addNote(id) {
    $("#noteModal").empty();
    $("#noteModal").append(`
      <div id="artId" class="text-center">
      </div>
      <h4 class="card-title text-center">ADD NOTE</h4>
      <div class="text-center">
        <textarea id="notes" class="" type="text"/>
      </div>
      <div class="text-center">
        <button id="noteSubmit" class="btn btn-primary" type="submit">Submit Note</button>
        <button id="close"  class="btn btn-danger" type="submit">Cancel</button>
      </div>
      </div>
      </div>

      `);

    let passedId = $("#artId");
    passedId.val(id);
  }


  $("#noteModal").on("click", "#noteSubmit", function (event) {
    event.preventDefault();
    if ($('#notes').val()) {

      const newNote = $('#notes').val();
      const newId = $('#artId').val();
      $.ajax({
        type: "POST",
        url: "/notes/" + newId,
        data: { body: newNote }
      }).then(function (scrape) {
        $("#noteModal").empty();
        modalAppearSaved("Note Added")
      });
    } else {
      modalAppearSaved("Note Not Added due to text box empty.")
    }
  })

  $("#noteModal").on("click", "#close", function (event) {
    event.preventDefault();
    $("#noteModal").empty();
    getSavedArticlesFromDB()
  })


  $("#articles").on("click", ".viewNote", function (event) {
    $("#noteModal").empty();
    event.preventDefault();
    let id = $(this).data("key");
    $.ajax({
      type: "GET",
      url: "/articles/" + id,
    }).then(function (articleAndNote) {
      let notes = "<div class='row'></div>"
      for (let i = 0; i < articleAndNote.notes.length; i++) {
        let noteId = articleAndNote.notes[i]._id;
        let artNote = articleAndNote.notes[i].body;
        let count = i + 1
        let artDiv = "<div class='col-md-12 border-bottom marbtn1 colHeight'><h5>" + count + ": " + artNote + " <span><button title='Deletes this Note for this Article' id='deleteNote'  class='btn btn-danger float-right' type='submit' data-key='" + id + "' data-keynote='" + noteId + "'>X</button></span></h5></div>"
        notes += artDiv;
      }
      $("#noteModal").append(`
        <div id="artId" class="text-center modal-content-head-img-bottom-space2">
        </div>
        <div class='border'>
        <h2 class="text-center">Notes for Article:</h2>
        <div>
        ${notes}
        </div>
        <div class="text-center">
          <button id="close"  class="btn btn-danger marbtn1" type="submit">Cancel</button>
        </div>
        </div>
      `);
    });
  })

  $("#home").on("click", function () {
    $("#noteModal").empty();
  })

  $("#savedArts").on("click", function () {
    $("#noteModal").empty();
  })

  $("#scrape").on("click", function () {
    $("#noteModal").empty();
  })

  function modalAppearScrape(message) {
    let msg = message;
    modalUp(msg);
    setTimeout(() => {
      getScrapedArticles();
    }, 3000);
  }

  function modalAppearSaved(message) {
    let msg = message;
    modalUp(msg);
    setTimeout(() => {
      getSavedArticlesFromDB();
    }, 3000);
  }

  function modalAppear(message) {
    let msg = message;
    modalUp(msg);
    setTimeout(() => {
      $('#myModal').modal('hide');
    }, 3000);
  }



  function modalUp(msg) {

    $('#myModal').modal('show');
    $('#modMsg').empty();
    $('#modMsg').append(
      `
      <h4 class="text-center">${msg}</h4>
      `);
    setTimeout(() => {
      $('#myModal').modal('hide');
    }, 4000);
  }

  $("#noteModal").on("click", "#deleteNote", function (event) {
    event.preventDefault();
    let id = $(this).data("key");
    let noteId = $(this).data("keynote");

    $.ajax({
      type: "DELETE",
      url: "/artNoteDelete/" + noteId,
    }).then(function (scrape) {
      removeNoteFromArray(id, noteId)
    });
  })

  function removeNoteFromArray(id, noteId) {
    $.ajax({
      type: 'POST',
      url: "/arrayNoteDelete/" + id + '/' + noteId,
    })
      .then(function (scrape) {
        $("#noteModal").empty();
        modalAppearSaved("Note Deleted")

      })
  }
});



