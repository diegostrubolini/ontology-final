package ar.edu.itba;

import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.ontology.OntClass;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.util.iterator.ExtendedIterator;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static spark.Spark.get;
import static spark.Spark.staticFileLocation;

public class App
{
    public static void main( String[] args ) throws Exception
    {
        OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM);

        InputStream in = App.class.getResourceAsStream("/pizza.owl.xml");
        if(in == null ){
            throw new Exception();
        }

        model.read(in, null);

        ExtendedIterator<OntClass> classes = model.listClasses();
        List<String> classesList = getClasses(classes);
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
            if(isNormalClass(cl)){
                result.add(cl.toString());
            }
        }
        return result;
    }

    private static boolean isNormalClass(OntClass cl) {
        return !cl.isRestriction() &&
                !cl.isEnumeratedClass() &&
                !cl.isComplementClass() &&
                !cl.isIntersectionClass() &&
                !cl.isUnionClass();
    }
}
