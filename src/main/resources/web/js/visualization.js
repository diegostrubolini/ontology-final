loadClassesInList();
loadPropertiesInList();

function loadClassesInList() {
    loadClasses(function (data){
        var classes = JSON.parse(data);
        loadButtons(classes, "classes", "btn-info");
    });
};

function loadPropertiesInList() {
    loadProperties(function (data){
        var properties = JSON.parse(data);
        loadPropertyButtons(properties, "properties", "btn-success");
    });
};


function getName(labeledClass){
    if(labeledClass.label !== undefined) {
        return labeledClass.label;
    }
    return labeledClass.iri;
}

function cleanInfoPanel() {
    $('#subclasses').empty();
    $('#superclasses').empty();
    $('#instances').empty();
    $('#comment').empty();
}

function cleanPropertyInfoPanel(){
    $('#range').empty();
    $('#domain').empty();
}

function showClassesInfoPlanel(){
    $('#classPanel').show();
    $('#propertyPanel').hide();
}
function showPropertiesInfoPlanel(){
    $('#classPanel').hide();
    $('#propertyPanel').show();
}
function loadButtons(classes, id, btnClass) {
    if(classes.length == 0){
        $("#" + id).append(addAlert("warning","No "+ id + " were found"));
        return;
    }
    classes.forEach(function(val){
        var classButton = $("<button>", {class: btnClass + " btn btn-sm class-btn"});
        classButton.text(getName(val));
        classButton.click(function () {
            loadClassInfo(function (info){
                showInfo(info);
            }, val.iri);
        });
        $("#" + id).append(classButton);
    });
}

function showInfo (info) {
	showClassesInfoPlanel();
    cleanInfoPanel();
    var classInfo = JSON.parse(info);
    $('#className').text(getName(classInfo.classId));
    loadButtons(classInfo.subclasses, "subclasses", "btn-warning");
    loadButtons(classInfo.superclasses, "superclasses", "btn-success");
    loadLabels(classInfo.instances, "instances", "instance-label");
    if(classInfo.comment === undefined){
        $("#comment").append(addAlert("warning","No description was found"));
    } else {
        $('#comment').append(addAlert("info", classInfo.comment ));
    }
}

function loadPropertyButtons(properties, id, btnClass) {
    if(properties.length == 0){
        $("#" + id).append(addAlert("warning","No "+ id + " were found"));
        return;
    }
    properties.forEach(function(val){
        var propertyButton = $("<button>", {class: btnClass + " btn btn-sm class-btn"});
        propertyButton.text(getName(val));
        propertyButton.click(function () {
             loadPropertyInfo(function (info){
                showPropertiesInfoPlanel();
                cleanPropertyInfoPanel();
                var propertyInfo = JSON.parse(info);
                $('#propertyName').text(propertyInfo.propId);
                createPropertyButton("range",propertyInfo.range );
                createPropertyButton ("domain",propertyInfo.domain);
            }, val);
        });
        $("#" + id).append(propertyButton);
    });
}

function createPropertyButton(id, value) {
    if(value === undefined) {
        $("#" + id).append(addAlert("warning","No "+ id + " was found"));
        return;
    }
    var button = $("<button>", {class:"btn-success btn btn-sm class-btn"});
    button.text(value);
    button.click(function () {
        loadClassInfo(function (info){
            showInfo(info);
        }, value);
    });
    $("#" + id).append(button);
}

function loadLabels(instances, id, labelClass) {
    if(instances.length == 0){
        $("#" + id).append(addAlert("warning","No "+ id + " were found"));
        return;
    }
    instances.forEach(function(val){
        var instanceButton = $("<div>", {class: labelClass + " btn btn-xs"});
        instanceButton.text(val);
        $("#" + id).append(instanceButton);
    });
}

function addAlert(level, text){
    var alert = $("<div>", {class: "alert alert-" +level});
    alert.text(text);
    alert.attr("role", "alert");
    return alert;
}