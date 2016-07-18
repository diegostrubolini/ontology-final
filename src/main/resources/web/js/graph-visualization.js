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
    
    var config = {
    	node: [{
    		show: 'hovers',
    		hide: 'hovers',
    		cssClass: 'sigma-tooltip',
    		position: 'left',
    		template:
    			'<div class="arrow"></div>' +
    		    ' <div class="sigma-tooltip-header">{{label}}</div>' +
    		    '  <div class="sigma-tooltip-body">' +
    		    '    <table>' +
    		    '      <tr><th>Name</th> <td>{{data.name}}</td></tr>' +
    		    '      <tr><th>Gender</th> <td>{{data.gender}}</td></tr>' +
    		    '      <tr><th>Age</th> <td>{{data.age}}</td></tr>' +
    		    '      <tr><th>City</th> <td>{{data.city}}</td></tr>' +
    		    '    </table>' +
    		    '  </div>' +
    		    '  <div class="sigma-tooltip-footer">Number of connections: {{degree}}</div>',
    		renderer: function(node, template) {
		      // The function context is s.graph
		      node.degree = this.degree(node.id);

		      // Returns an HTML string:
		      return Mustache.render(template, node);

		      // Returns a DOM Element:
		      //var el = document.createElement('div');
		      //return el.innerHTML = Mustache.render(template, node);
		    }
    	}]
    };

    classes.forEach(function (classInfo) {
    	g.nodes.push({
		    id: classInfo.classId,
		    label: getName(classInfo.classId),
		    x: Math.random(),
		    y: Math.random(),
		    size: 1,
		    color: '#666',
		    data: {
		    	name: 'Germán Rodrigo Romarión',
		    	gender: 'Male',
		    	age: 25,
		    	city: 'Buenos Aires'
		    }
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
            sigma.plugins.tooltips(s, s.renderers[0], config);
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