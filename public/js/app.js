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

    $('#exampleModalCenter').modal('show');
    $(".saveBtn").on("click", function() {
        var comment = $(".cmtTxt").val().trim();

        var data = {
            id: id,
            comment: comment
        }
        $(".cmtTxt").val("");
        $.post("/comment", data, function() {}).done(location.reload())

    })
})