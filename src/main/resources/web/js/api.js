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

function loadClassesInfo(callback) {
    performQuery(callback, "/allClasses", {});
}

function loadClassInfo(callback, name) {
    performQuery(callback, "/classes", {"class" : name});
}