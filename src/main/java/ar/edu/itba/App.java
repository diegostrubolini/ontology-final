package ar.edu.itba;

import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.ontology.Individual;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.*;
import org.apache.jena.util.FileManager;
import org.apache.jena.util.iterator.ExtendedIterator;

import static spark.Spark.get;
import static spark.Spark.staticFileLocation;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class App
{
    public static void main( String[] args ) throws Exception
    {
        OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM);

        InputStream in = App.class.getResourceAsStream("/wine.rdf");
        if(in == null ){
            throw new Exception();
        }

        model.read(in, null);

        ExtendedIterator<OntClass> classes = model.listClasses();
        List<String> classesList = new ArrayList<>();
        while (classes.hasNext()) {
            OntClass thisClass = classes.next();
            if(!thisClass.isRestriction()){
                classesList.add(thisClass.toString());
            }
        }
        staticFileLocation("/web");
        get("/classes", (req, res) -> {
            String classId = req.queryParams("class");
            if(StringUtils.isBlank(classId)) {
                return new Gson().toJson(classesList);
            }
            OntClass ontClass = model.getOntClass(classId);
            Map<String, Object> classInfo = new HashMap<>();
            List<String> subclasses = getClasses(ontClass.listSubClasses());
            List<String> superclasses = getClasses(ontClass.listSuperClasses());
            classInfo.put("subclasses", subclasses);
            classInfo.put("superclasses", superclasses);
            classInfo.put("classId", ontClass.toString());
            return new Gson().toJson(classInfo);

        });

    }

    private static List<String> getClasses(ExtendedIterator<OntClass> it) {
        List<String> result = new ArrayList<>();
        while(it.hasNext()){
            OntClass cl = it.next();
            if(!cl.isRestriction()){
                result.add(cl.toString());
            }
        }
        return result;
    }
}
