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

function loadProperties(callback) {
    performQuery(callback, "/properties", {});
}

function loadClassesInfo(callback) {
    performQuery(callback, "/allClasses", {});
}

function loadClassInfo(callback, name) {
    performQuery(callback, "/classes", {"class" : name.iri});
}

function loadPropertyInfo(callback, name) {
    performQuery(callback, "/properties", {"prop" : name.iri});
}