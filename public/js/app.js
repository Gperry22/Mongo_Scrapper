$(document).ready(function() {

// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


  $("#scrape").on("click", function(event) {
    event.preventDefault();
    $.ajax( {
      type: "GET",
      url: "/api/scrape",
    }).then(function(scrape) {
      getScrapedArticles();
    });
  });



  $("#savedArts").on("click", function(event) {
    event.preventDefault();
    getSavedArticlesFromDB();
  });



  function getSavedArticlesFromDB() {
    $("#articles").empty();
    $.ajax("/api/savedArticles", {
      type: "GET"
    }).then(function(savedArticles) {
      if (savedArticles.length > 0) {
        for (let i = 0; i < savedArticles.length; i++) {
          let id = savedArticles[i]._id.toString();
          let title = savedArticles[i].title;
          let link = savedArticles[i].link;
          let input = "Save Article";
          $("#articles").append(`                
              <div class="col-md-9 artbg text-center">
                <h5>
                ${title}
                </h5>
                <a href="${link}" target="_blank">${link}</a>
              </div>
              <div class="col-md-3 artbg text-center align-middle">
                <button class='btn btn-success saveArticle' data-key='${id}'>Add Note</button>
                <button class='btn btn-danger removeArticle' data-key='${id}'>Delete Article</button>
              </div>                   
            `);
        }
      } else {
        const noSave = "You have not Saved Any Articles";
        modalUp(noSave);
      }
    });
  }


  function getScrapedArticles() {
    $("#articles").empty();
    $.ajax("/api/articles", { type: "GET" }).then(function(scrape) {
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
          // let notebtn = "<button onclick=addNote(" + id + ") class='btn btn-primary'> Add Note </button>";
          // let delbtn  = "<button onclick=delete(" + id + ") class='btn btn-danger'> Delete </button>";
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
      }
    });
  }



  $("#home").on("click", function(event) {
    event.preventDefault();
    getScrapedArticles();
  });



  $("#articles").on("click", ".saveArticle", function(event) {
    $("#articles").empty();
    let id = $(this).data("key");
    $.ajax({
      type: "POST",
      url: "/save/" + id,
      data: id
    }).then(function(scrape) {
      console.log(scrape);
      const addSave = "Article Added";
      modalUp(addSave);
      setTimeout(() => {
        getScrapedArticles();
      }, 4000);    
    });
  });



  $("#articles").on("click", ".removeArticle", function(event) {
    $("#articles").empty();
    let id = $(this).data("key");
    $.ajax({
      type: "POST",
      url: "/remove/" + id,
      data: id
    }).then(function(scrape) {
      console.log(scrape);      
      const removeSave = "Article Removed";
      modalUp(removeSave);  
      setTimeout(() => {
        getSavedArticlesFromDB();
      }, 4000);
    });
  });




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


});



//   let result = [];
//   array1.forEach(e => {
//     if (result.indexOf(e.age) === -1) {
//       result.push(e.age);
//     }
//   });

// <button type="submit" onclick="saveTheArticle(${id})" class="btn btn-danger">Save Article</button>




  // function saveTheArticle() {
  //   console.log("HOLA");
  // }

