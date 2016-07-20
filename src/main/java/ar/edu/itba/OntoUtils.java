package ar.edu.itba;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntProperty;
import org.apache.jena.ontology.OntResource;
import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.util.iterator.ExtendedIterator;
import org.apache.jena.vocabulary.RDFS;

public class OntoUtils {
    public static Map<String, Object> getClassInfo(OntModel model, String classId) {
        OntClass ontClass = model.getOntClass(classId);
        Map<String, Object> classInfo = new HashMap<>();
        List<LabeledClass> subclasses = itClassesToList(ontClass.listSubClasses(), model);
        List<LabeledClass> superclasses = itClassesToList(ontClass.listSuperClasses(), model);
        List<String> instances = itInstancesToList(ontClass.listInstances(), model);
        List<LabeledClass> isDomainOf = itPropertiesToList(ontClass.listDeclaredProperties(),model);
        List<LabeledClass> isRangeOf = getRangeOf(ontClass);
        classInfo.put("subclasses", subclasses);
        classInfo.put("superclasses", superclasses);
        classInfo.put("isDomainOf", isDomainOf);
        classInfo.put("isRangeOf", isRangeOf);
        classInfo.put("instances", instances);
        classInfo.put("classId", ontClass.toString());
        classInfo.put("shortName", model.shortForm(classId));
        if(ontClass.getProperty(RDFS.comment) != null) {
            classInfo.put("comment", ontClass.getProperty(RDFS.comment).getObject().toString());
        }
        return classInfo;
    }

    private static List<LabeledClass> getRangeOf(OntClass ontClass) {
        List<LabeledClass> l = new ArrayList<>();
        OntModel model = ontClass.getOntModel();
        String queryString =
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
                        "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>  "+
                        "select ?uri "+
                        "where { "+
                        "?uri rdfs:range <"+ontClass.toString()+">  "+
                        "} \n ";
        Query query = QueryFactory.create(queryString);

        QueryExecution qe = QueryExecutionFactory.create(query, model);
        ResultSet results =  qe.execSelect();
        while(results.hasNext()){
            QuerySolution solution = results.nextSolution();
            OntResource res = (OntResource) solution.getResource("uri");
            l.add(createLabeledClass(model, res));
        }
        qe.close();
        return l;
    }

    public static List<Map<String, Object>> getClassesInfo(OntModel model) {
        List<Map<String, Object>> ans = new ArrayList<>();
        for (LabeledClass clazz : getClasses(model)) {
            ans.add(getClassInfo(model, clazz.iri));
        }
        return ans;
    }

    public static List<LabeledClass> itClassesToList(ExtendedIterator<OntClass> it, OntModel model) {
        List<LabeledClass> result = new ArrayList<>();
        while (it.hasNext()) {
            OntClass cl = it.next();
            if (isNormalClass(cl)) {
                LabeledClass l = createLabeledClass(model, cl);
                result.add(l);
            }
        }
        return result;
    }

    private static LabeledClass createLabeledClass(OntModel model, OntResource res) {
        LabeledClass l = new LabeledClass();
        l.iri = res.toString();
        l.label = res.getLabel("en");
        if (l.label == null ){
            l.label = res.getLabel("");
        }
        l.shortName = model.shortForm(res.toString());
        return l;
    }

    public static List<String> itInstancesToList(ExtendedIterator<?> it, OntModel model) {
        List<String> result = new ArrayList<>();
        while (it.hasNext()) {
            result.add(model.shortForm(it.next().toString()));
        }
        return result;
    }

    public static List<LabeledClass> getClasses(OntModel model) {
        return itClassesToList(model.listClasses(), model);
    }

    public static boolean isNormalClass(OntClass cl) {
        return !cl.isRestriction() && !cl.isEnumeratedClass() && !cl.isComplementClass() && !cl.isIntersectionClass()
                && !cl.isUnionClass();
    }

    public static List<LabeledClass> getProperties(OntModel model) {
        return itPropertiesToList(model.listAllOntProperties(), model);
    }


    public static List<LabeledClass> itPropertiesToList(ExtendedIterator<OntProperty> it, OntModel model) {
        List<LabeledClass> result = new ArrayList<>();
        while (it.hasNext()) {
            OntProperty prop = it.next();
            LabeledClass l = new LabeledClass();
            l.label = prop.getLabel("en");
            l.iri = prop.toString();
            l.shortName = model.shortForm(prop.toString());
            result.add(l);
        }
        return result;

    }

    public static Map<String, Object> getPropertyInfo(OntModel model, String propId) {

        OntProperty ontProp = model.getOntProperty(propId);
        Map<String, Object> propInfo = new HashMap<>();
        if (ontProp.getRange() != null) {
            propInfo.put("range", createLabeledClass(model, ontProp.getRange()));
        }
        if (ontProp.getDomain() != null) {
            propInfo.put("domain", createLabeledClass(model, ontProp.getDomain()));
        }
        propInfo.put("classId", ontProp.toString());
        propInfo.put("shortName", model.shortForm(propId));
        return propInfo;
    }


}