package ar.edu.itba;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.apache.jena.vocabulary.RDFS;

public class OntoUtils {
    public static Map<String, Object> getClassInfo(OntModel model, String classId) {
        OntClass ontClass = model.getOntClass(classId);
        Map<String, Object> classInfo = new HashMap<>();
        List<LabeledClass> subclasses = itClassesToList(ontClass.listSubClasses());
        List<LabeledClass> superclasses = itClassesToList(ontClass.listSuperClasses());
        List<String> instances = itInstancesToList(ontClass.listInstances());
        classInfo.put("subclasses", subclasses);
        classInfo.put("superclasses", superclasses);
        classInfo.put("instances", instances);
        classInfo.put("classId", ontClass.toString());
        if(ontClass.getProperty(RDFS.comment) != null) {
            classInfo.put("comment", ontClass.getProperty(RDFS.comment).getObject().toString());
        }
        return classInfo;
    }

    public static List<Map<String, Object>> getClassesInfo(OntModel model) {
        List<Map<String, Object>> ans = new ArrayList<>();
        for (LabeledClass clazz : getClasses(model)) {
            ans.add(getClassInfo(model, clazz.iri));
        }
        return ans;
    }

    public static List<LabeledClass> itClassesToList(ExtendedIterator<OntClass> it) {
        List<LabeledClass> result = new ArrayList<>();
        while (it.hasNext()) {
            OntClass cl = it.next();
            if (isNormalClass(cl)) {
                LabeledClass l = new LabeledClass();
                l.iri = cl.toString();
                l.label = cl.getLabel("en");
                if (l.label == null ){
                    l.label = cl.getLabel("");
                }
                result.add(l);
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

    public static List<LabeledClass> getClasses(OntModel model) {
        return itClassesToList(model.listClasses());
    }

    public static boolean isNormalClass(OntClass cl) {
        return !cl.isRestriction() && !cl.isEnumeratedClass() && !cl.isComplementClass() && !cl.isIntersectionClass()
                && !cl.isUnionClass();
    }

    public static List<LabeledClass> getProperties(OntModel model) {
        return itPropertiesToList(model.listAllOntProperties());
    }


    public static List<LabeledClass> itPropertiesToList(ExtendedIterator<OntProperty> it) {
        List<LabeledClass> result = new ArrayList<>();
        while (it.hasNext()) {
            OntProperty prop = it.next();
            LabeledClass l = new LabeledClass();
            l.label = prop.getLabel("en");
            l.iri = prop.toString();
            result.add(l);
        }
        return result;

    }

    public static Map<String, Object> getPropertyInfo(OntModel model, String propId) {

        OntProperty ontProp = model.getOntProperty(propId);
        Map<String, Object> propInfo = new HashMap<>();
        if (ontProp.getRange() != null) {
            propInfo.put("range", ontProp.getRange().toString());
        }
        if (ontProp.getDomain() != null) {
            propInfo.put("domain", ontProp.getDomain().toString());
        }
        propInfo.put("classId", ontProp.toString());
        return propInfo;
    }


}