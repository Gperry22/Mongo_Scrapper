$(document).ready(function () {


    $("#scrape").on("click", function (event) {
        event.preventDefault();



        $.ajax("/api/scrape", {
            type: "GET",
        }).then(function (dbArticle) {
            // console.log(dbArticle);
            console.log("Now Getting All Articles");
            getAllArticles();
        })
    })
})



function getAllArticles() {
    $.ajax("/articles", {
        type: "GET",
    }).then(function (dbArticle) {
        // console.log(dbArticle);
        console.log(dbArticle);
    })
}



// test(1, function(data){
//     res.json(data)

// })

// function test (param1, cb){
//     ajax param1{dtTasker}
//     return cb (dtTasker)
           
// }
