package ar.edu.itba;

import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.ModelFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import static spark.Spark.get;
import static spark.Spark.staticFileLocation;

public class App
{
    public static void main( String[] args ) throws Exception
    {
        OntModel model = ModelFactory.createOntologyModel(OntModelSpec.OWL_MEM);

        InputStream in;
        if(args.length == 0) {
            in = App.class.getResourceAsStream("/ejemplo_clases.owl");
        } else {
            in = new FileInputStream(new File(args[0]));
        }
        if(in == null ){
            throw new Exception();
        }

        model.read(in, null);

        staticFileLocation("/web");
        get("/classes", (req, res) -> {
            String classId = req.queryParams("class");
            if(StringUtils.isBlank(classId)) {
            	String gson = new Gson().toJson(OntoUtils.getClasses(model));
                return gson;
            }
            return new Gson().toJson(OntoUtils.getClassInfo(model, classId));
        });
        
        get("/allClasses", (req, res) -> {
            return new Gson().toJson(OntoUtils.getClassesInfo(model));
        });
    }
}
