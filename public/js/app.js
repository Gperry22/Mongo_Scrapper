$(document).ready(function() {


  $("#scrape").on("click", function(event) {
    event.preventDefault();
    $.ajax("/api/scrape", {
      type: "GET"
    }).then(function(scrape) {
      console.log(scrape);
      getScrapedArticles();
    });
  });



  function getScrapedArticles() {
    $.ajax("/api/articles", {
      type: "GET"
    }).then(function(scrape) {
        console.log(scrape);
        if (scrape.length > 0) {
            for (let i = 0; i < scrape.length; i++) {
                let id = scrape[i]._id.toString();
                console.log(typeof(id));
                
                let title = scrape[i].title;
                let link = scrape[i].link;
                let input = "Save Article";
                // let notebtn = "<button onclick=addNote(" + id + ") class='btn btn-primary'> Add Note </button>";
                // let delbtn  = "<button onclick=delete(" + id + ") class='btn btn-danger'> Delete </button>";
                let saveArticle = "<button onclick=saveTheArticle(" + id + ") class='btn btn-danger'>Save Article</button>";                     
                  $("#articlesss").append(`                
                      <div class="col-md-9 artbg text-center">
                        <h5>
                        ${title}
                        </h5>
                        <a href="${link}" target="_blank">${link}</a>
                      </div>
                      <div class="col-md-3 artbg text-center align-middle">
                        ${saveArticle}
                        <button onclick="saveTheArticle2()" class='btn btn-danger'>HELLO</button>
                      </div>                   
                    `);           
                }           
             }
          });
    }

  $("#home").on("click", function (event) {
    event.preventDefault();
      getScrapedArticles();
  });

  function saveTheArticle() {
    console.log("HOLA");
  }


  function saveTheArticle2() {
    console.log("HOLA");
  }




});



//   let result = [];
//   array1.forEach(e => {
//     if (result.indexOf(e.age) === -1) {
//       result.push(e.age);
//     }
//   });

// <button type="submit" onclick="saveTheArticle(${id})" class="btn btn-danger">Save Article</button>



// function saveArticle(id){
//   console.log(id);

//   $.ajax("/save/" + id, {
//     type: "POST",
//     data: id
//   }).then(function (scrape) {
//     console.log(scrape);
//     // getScrapedArticles();
//   });

// }
