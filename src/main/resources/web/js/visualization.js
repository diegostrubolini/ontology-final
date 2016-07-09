loadClassesInList();

function loadClassesInList() {
    loadClasses(function (data){
        var classes = JSON.parse(data);
        loadButtons(classes, "classes", "btn-info");
    });
};

function getName(ontName){
    return ontName.split("#")[1];
}

function cleanInfoPanel() {
    $('#subclasses').empty();
    $('#superclasses').empty();
}

function loadButtons(classes, id, btnClass) {
    if(classes.length == 0){
        $("#" + id).append(addAlert("warning","No "+ id + " were found"));
        return;
    }
    classes.forEach(function(val){
        var classButton = $("<button>", {class: btnClass + " btn class-btn"});
        classButton.text(getName(val));
        classButton.click(function () {
            loadClassInfo(function (info){
                cleanInfoPanel();
                var classInfo = JSON.parse(info);
                $('#className').text(getName(classInfo.classId));
                loadButtons(classInfo.subclasses, "subclasses", "btn-warning");
                loadButtons(classInfo.superclasses, "superclasses", "btn-success");
            }, val);
        });
        $("#" + id).append(classButton);
    });
}

function addAlert(level, text){
    var alert = $("<div>", {class: "alert alert-" +level});
    alert.text(text);
    alert.attr("role", "alert");
    return alert;
}