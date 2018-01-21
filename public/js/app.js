$(".saveBtn").on("click", function() {
    var id = $(this).attr("name");

    var data = {
        id: id
    }

    $.post("/saveIt", data, function() {});
})

$(".delBtn").on("click", function() {
    var id = $(this).attr("name")

    var data = {
        id: id
    }

    $.post("/deleteIt", data, function() {}).done(location.reload());
})

$(".comBtn").on("click", function() {
    var id = $(this).attr("name");

    // $('#exampleModalCenter').modal('show');
    $(".saveBtn").on("click", function() {

        var name = $("#name" + id).val().trim();
        var comment = $("#text" + id).val().trim();

        if (!$("#text" + id)) {
            alert("You have to type something to leave a comment!")
        } else {
            var data = {
                id: id,
                name: name,
                comment: comment
            }
            // $(".cmtTxt").val("");
            $.post("/comment", data, function() {}).done(location.reload())
        }
    })

})

// handle comment delete
$(".comDelBtn").on("click", function() {
    var id = $(this).attr("data-id");

    var data = {
        id: id
    }

    $.post("/deleteComm", data, function() {}).done(location.reload())
})