loadClassesInList();

function loadClassesInList() {
    loadClasses(function (data){
        var classes = JSON.parse(data);
        loadButtons(classes, "classes", "btn-info");
        drawGraph(classes);
    });
};

function getName(ontName){
    return ontName.split("#")[1];
}

function cleanInfoPanel() {
    $('#subclasses').empty();
    $('#superclasses').empty();
    $('#instances').empty();
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
                cleanInfoPanel();
                var classInfo = JSON.parse(info);
                $('#className').text(getName(classInfo.classId));
                loadButtons(classInfo.subclasses, "subclasses", "btn-warning");
                loadButtons(classInfo.superclasses, "superclasses", "btn-success");
                loadLabels(classInfo.instances, "instances", "instance-label");

            }, val);
        });
        $("#" + id).append(classButton);
    });
}

function drawGraph(classes, id) {
	var g = {
	      nodes: [],
	      edges: []
	    },
	    currentNode,
	    i = 0;
	console.log("before");
	classes.forEach(function(val) {
		currentNode = val;
		var className = getName(val);
		g.nodes.push({
		    id: currentNode,
		    label: className,
		    x: Math.random(),
		    y: Math.random(),
		    size: 1,
		    color: '#666'
		});
		loadClassInfo(function (info) {
            cleanInfoPanel();
            var classInfo = JSON.parse(info);
            classInfo.subclasses.forEach(function(subclass) {
            	g.edges.push({
    			    id: 'e' + i++,
    			    source: currentNode,
    			    target: subclass,
    			    size: 1,
    			    color: '#ccc'
    			});
            });
            classInfo.superclasses.forEach(function(superclass) {
            	g.edges.push({
    			    id: 'e' + i++,
    			    source: currentNode,
    			    target: superclass,
    			    size: 1,
    			    color: '#ccc'
    			});
            });
            console.log("done");
        }, val);
	});
	console.log("after");

	new sigma({
	  graph: g,
	  container: 'graph-container'
	});
}

function loadLabels(instances, id, labelClass) {
    if(instances.length == 0){
        $("#" + id).append(addAlert("warning","No "+ id + " were found"));
        return;
    }
    instances.forEach(function(val){
        var instanceButton = $("<div>", {class: labelClass + " btn btn-xs"});
        instanceButton.text(getName(val));
        $("#" + id).append(instanceButton);
    });
}

function addAlert(level, text){
    var alert = $("<div>", {class: "alert alert-" +level});
    alert.text(text);
    alert.attr("role", "alert");
    return alert;
}