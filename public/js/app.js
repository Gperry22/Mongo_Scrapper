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
                let id = scrape[i]._id;
                let title = scrape[i].title;
                let link = scrape[i].link;
                let notebtn = "<button onclick=addNote(" + id + ") class='btn btn-primary'> Add Note </button>";
                let delbtn  = "<button onclick=delete(" + id + ") class='btn btn-danger'> Delete </button>";
                $("#articles").append(`
                
                <div class="col-md-9 artbg text-center">
                    <h5>
                    ${title}
                    </h5>
                    <a href="${link}" target="_blank">${link}</a>
                </div>
                <div class="col-md-3 artbg text-center align-middle">
                    ${notebtn}
                    ${delbtn}
                </div>
                    
`);

           
            }
            
        }


    });
  }
});



//   let result = [];
//   array1.forEach(e => {
//     if (result.indexOf(e.age) === -1) {
//       result.push(e.age);
//     }
//   });