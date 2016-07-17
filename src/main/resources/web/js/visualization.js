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
    var classesSize = classes.length;

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
		loadClassesInfo(function (info) {
            var classesInfo = JSON.parse(info);
            classesInfo.forEach(function (classInfo) {
            	classInfo.subclasses.forEach(function(subclass) {
                	createEdge(g, currentNode, subclass, 'e' + i++);	
                });
                classInfo.superclasses.forEach(function(superclass) {
                	createEdge(g, currentNode, superclass, 'e' + i++);	
                });
                classesSize--;
                if(classesSize == 0) {
                    new sigma({
                        graph: g,
                        container: 'graph-container'
                    });
                }
            });
        }, val);
	});
}

function createEdge(graph, source, target, id) {
	graph.edges.push({
	    id: id,
	    source: source,
	    target: target,
	    size: 1,
	    color: '#ccc'
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