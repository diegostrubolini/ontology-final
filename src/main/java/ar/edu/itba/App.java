package ar.edu.itba;

import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.ModelFactory;

import java.io.InputStream;
import java.util.List;

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
        
        staticFileLocation("/web");
        get("/classes", (req, res) -> {
            String classId = req.queryParams("class");
            if(StringUtils.isBlank(classId)) {
                return new Gson().toJson(OntoUtils.getClasses(model));
            }
            return new Gson().toJson(OntoUtils.getClassInfo(model, classId));

        });

    }

}
