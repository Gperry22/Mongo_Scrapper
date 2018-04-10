$(document).ready(function () {


    $("#scrape").on("click", function (event) {
        event.preventDefault();



            $.ajax("/api/scrape", {
                type: "GET",
     
            }).then(function (scrape) {
                console.log(scrape);
            })
    })




})


// test(1, function(data){
//     res.json(data)

// })

// function test (param1, cb){
//     ajax param1{dtTasker}
//     return cb (dtTasker)
           
// }
