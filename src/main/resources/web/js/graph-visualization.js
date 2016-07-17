loadClassesInList();

function loadClassesInList() {
	loadClassesInfo(function (data){
        var classes = JSON.parse(data);
        drawGraph(classes);        
    });
};

function drawGraph(classes) {
	var g = {
	      nodes: [],
	      edges: []
	    },
	    currentNode,
	    i = 0;
    var classesSize = classes.length;

    classes.forEach(function (classInfo) {
    	g.nodes.push({
		    id: classInfo.classId,
		    label: getName(classInfo.classId),
		    x: Math.random(),
		    y: Math.random(),
		    size: 1,
		    color: '#666'
		});
        classInfo.superclasses.forEach(function(superclass) {
        	createEdge(g, classInfo.classId, superclass, 'e' + i++, ['line', 'curve', 'arrow', 'curvedArrow'][Math.random() * 4 | 0]);	
        });
        classesSize--;
        if(classesSize == 0) {
            new sigma({
                graph: g,
                container: 'graph-container',
                renderer: {
                    container: document.getElementById('graph-container'),
                    type: 'canvas'
                },
                settings: {
                	edgeLabelSize: 'proportional',
                    edgeLabelThreshold: 10,
                    minEdgeSize: 10
                }
            }).refresh();
        }
    });
}

function createEdge(graph, source, target, id, type) {
	var edge = {
	    id: id,
	    label: "lala",
	    source: source,
	    target: target,
	    size: 1,
	    color: '#ccc',
	    type: type
	};
	graph.edges.push(edge);
	return edge;
}