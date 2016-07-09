function performQuery(callback, url, formData) {
    $.ajax({
        type: "GET",
        url: url,
        data: formData
    }).done(callback);
};


function loadClasses(callback) {
    performQuery(callback, "/classes", {});
}

function loadClassInfo(callback, name) {
    performQuery(callback, "/classes", {"class" : name});
}