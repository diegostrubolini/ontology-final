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
    		show: 'rightClickNode',
    		hide: 'hovers',
    		cssClass: 'sigma-tooltip',
    		position: 'left',
    		template:
    			'<div class="arrow"></div>' +
    		    ' <div class="sigma-tooltip-header">{{label}}</div>' +
    		    '  <div class="sigma-tooltip-body">' +
    		    '    <table>' +
    		    '      <tr><th>Superclass:</th> <td> {{data.superclass}}</td></tr>' +
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
    	var node = {
		    id: classInfo.classId,
		    label: classInfo.classId,
		    x: Math.random(),
		    y: Math.random(),
		    size: 1,
		    color: '#666',
		    data: {
		    	superclass: "<None>"
		    }
		};
    	g.nodes.push(node);
        classInfo.superclasses.forEach(function(superclass) {
        	if ((typeof superclass.iri) !== 'undefined') {
        		node.data.superclass = superclass.iri;         		
        	}
        	createEdge(g, classInfo.classId, superclass.iri, 'e' + i++);	
        });
        classesSize--;
        if(classesSize == 0) {
        	sigma.renderers.def = sigma.renderers.canvas;
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
                    edgeHoverHighlightNodes: 'circle',
                    edgeHoverExtremities: true,
                    animationsTime: 1500,
                    dragNodeStickiness: 0.01,
                    nodeBorderSize: 2,
                    defaultNodeBorderColor: '#000',
                    defaultNodeActiveBorderColor: '#fff',
                    defaultNodeActiveOuterBorderColor: 'rgb(236, 81, 72)',
                    nodeHaloColor: 'rgba(236, 81, 72, 0.2)',
                    nodeHaloSize: 50
                }
            });
            sigma.plugins.tooltips(s, s.renderers[0], config);
            var activeState = sigma.plugins.activeState(s);

	        // Initialize the dragNodes plugin:
	        var dragListener = sigma.plugins.dragNodes(s, s.renderers[0], activeState);
	        var select = sigma.plugins.select(s, activeState);
	        var keyboard = sigma.plugins.keyboard(s, s.renderers[0]);
	        select.bindKeyboard(keyboard);
	        var lasso = new sigma.plugins.lasso(s, s.renderers[0], {
        	  'strokeStyle': 'rgb(236, 81, 72)',
        	  'lineWidth': 2,
        	  'fillWhileDrawing': true,
        	  'fillStyle': 'rgba(236, 81, 72, 0.2)',
        	  'cursor': 'crosshair'
        	});

        	select.bindLasso(lasso);
        	lasso.activate();
        	// halo on active nodes:
        	function renderHalo() {
        	  s.renderers[0].halo({
        	    nodes: activeState.nodes()
        	  });
        	}

        	s.renderers[0].bind('render', function(e) {
        	  renderHalo();
        	});
        	keyboard.bind('32+83', function() {
    		  if (lasso.isActive) {
    		    lasso.deactivate();
    		  } else {
    		    lasso.activate();
    		  }
    		});
        	// Listen for selectedNodes event
        	lasso.bind('selectedNodes', function (event) {
        	  setTimeout(function() {
        	    lasso.deactivate();
        	    s.refresh({ skipIdexation: true });
        	  }, 0);
        	});
	        // Curve parallel edges:
//	        sigma.canvas.edges.autoCurve(s);
	        s.refresh();
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