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
        	createEdge(g, classInfo.classId, superclass, 'e' + i++);	
        });
        classesSize--;
        if(classesSize == 0) {
            var s = new sigma({
                graph: g,
                renderer: {
                    container: document.getElementById('graph-container'),
                    type: 'canvas'
                },
                settings: {
                	edgeLabelSize: 'proportional',
                    edgeLabelThreshold: 4,
                    maxEdgeSize: 3,
                    enableEdgeHovering: true,
                    edgeHoverColor: 'edge',
                    edgeHoverSizeRatio: 1,
                    edgeHoverExtremities: true,
                    animationsTime: 1500,
                    dragNodeStickiness: 0.01,
                    nodeBorderSize: 2,
                    defaultNodeBorderColor: '#000'
                }
            });
        }
    });
}

function createEdge(graph, source, target, id) {
	graph.edges.push({
	    id: id,
	    source: source,
	    target: target,
	    size: 1,
	    color: '#ccc',
	    hover_color: '#000',
	    type: 'curvedArrow'
	});
}