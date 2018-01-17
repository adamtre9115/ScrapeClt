$(".saveBtn").on("click", function() {
    var id = $(this).attr("name");

    var data = {
        id: id
    }

    $.post("/saveIt", data, function() {});
})