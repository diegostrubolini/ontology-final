package ar.edu.itba;

import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntResource;
import org.apache.jena.util.iterator.ExtendedIterator;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static spark.Spark.get;

public class OntoUtils {
	public static Map<String, Object> getClassInfo(OntModel model, String classId) {
		OntClass ontClass = model.getOntClass(classId);
		Map<String, Object> classInfo = new HashMap<>();
		List<String> subclasses = itClassesToList(ontClass.listSubClasses());
		List<String> superclasses = itClassesToList(ontClass.listSuperClasses());
		List<String> instances = itInstancesToList(ontClass.listInstances());
		classInfo.put("subclasses", subclasses);
		classInfo.put("superclasses", superclasses);
		classInfo.put("instances", instances);
		classInfo.put("classId", ontClass.toString());
		return classInfo;
	}

	public static List<String> itClassesToList(ExtendedIterator<OntClass> it) {
		List<String> result = new ArrayList<>();
		while (it.hasNext()) {
			OntClass cl = it.next();
			if (isNormalClass(cl)) {
				result.add(cl.toString());
			}
		}
		return result;
	}

	public static List<String> itInstancesToList(ExtendedIterator<?> it) {
		List<String> result = new ArrayList<>();
		while (it.hasNext()) {
			result.add(it.next().toString());
		}
		return result;
	}

	public static List<String> getClasses(OntModel model) {
		return itClassesToList(model.listClasses());
	}

	public static boolean isNormalClass(OntClass cl) {
		return !cl.isRestriction() && !cl.isEnumeratedClass() && !cl.isComplementClass() && !cl.isIntersectionClass()
				&& !cl.isUnionClass();
	}
}
