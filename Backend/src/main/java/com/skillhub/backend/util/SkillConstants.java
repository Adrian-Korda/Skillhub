package com.skillhub.backend.util;

import java.util.Set;

public class SkillConstants {
    // target list to get rid of trash data
    public static final Set<String> TARGET_SKILLS = Set.of(
            // programming languages
            "PYTHON", "JAVA", "JAVASCRIPT", "TYPESCRIPT", "C", "C++", "C#", "GO", "GOLANG", "RUST",
            "PHP", "RUBY", "SWIFT", "KOTLIN", "SCALA", "PERL", "LUA", "HASKELL", "ELIXIR", "CLOJURE",
            "GROOVY", "JULIA", "R", "MATLAB", "DART", "BASH", "SHELL", "POWERSHELL", "ASSEMBLY", "VBA",

            // frontend libraries and mobile frameworks
            "REACT", "ANGULAR", "VUE", "VUE.JS", "SVELTE", "NEXT.JS", "NUXT.JS", "EMBER", "JQUERY",
            "HTML", "CSS", "SASS", "LESS", "TAILWIND", "BOOTSTRAP", "MATERIAL UI", "CHAKRA UI",
            "FLUTTER", "REACT NATIVE", "IONIC", "XAMARIN", "MAUI", "ANDROID", "IOS", "SWIFTUI",
            "JETPACK COMPOSE", "WEBPACK", "VITE", "REDUX", "GRAPHQL", "WEBASSEMBLY",

            // backend frameworks and technologies
            "NODE", "NODE.JS", "DENO", "BUN", "SPRING", "SPRING BOOT", "HIBERNATE", "DJANGO", "FLASK",
            "FASTAPI", "RAILS", "RUBY ON RAILS", "LARAVEL", "SYMFONY", ".NET", "ASP.NET", "ASP.NET CORE",
            "EXPRESS", "NESTJS", "KOA", "PHOENIX", "BLAZOR", "GRPC", "APOLLO", "WORDPRESS", "DRUPAL",

            // databases and storage solutions
            "SQL", "MYSQL", "POSTGRES", "POSTGRESQL", "MONGODB", "REDIS", "CASSANDRA", "COUCHBASE",
            "DYNAMODB", "FIRESTORE", "FIREBASE", "SUPABASE", "REALM", "MARIADB", "SQLITE", "ORACLE",
            "SQL SERVER", "MSSQL", "ELASTICSEARCH", "NEO4J", "HBASE", "HIVE", "SNOWFLAKE", "DATABRICKS",

            // devops, cloud infrastructure and ci/cd tools
            "DOCKER", "KUBERNETES", "AWS", "AMAZON WEB SERVICES", "AZURE", "GCP", "GOOGLE CLOUD",
            "DIGITALOCEAN", "HEROKU", "VERCEL", "NETLIFY", "LINUX", "UNIX", "UBUNTU", "CENTOS", "REDHAT",
            "GIT", "GITHUB", "GITLAB", "BITBUCKET", "JENKINS", "CIRCLECI", "TRAVIS CI", "GITHUB ACTIONS",
            "TERRAFORM", "ANSIBLE", "CHEF", "PUPPET", "PROMETHEUS", "GRAFANA", "KIBANA", "SPLUNK",
            "DATADOG", "NEW RELIC", "NGINX", "APACHE", "HELM", "ARGO CD", "OPENSHIFT",

            // data science, ai and machine learning
            "MACHINE LEARNING", "ARTIFICIAL INTELLIGENCE", "DEEP LEARNING", "TENSORFLOW", "PYTORCH",
            "KERAS", "SCIKIT-LEARN", "PANDAS", "NUMPY", "SCIPY", "MATPLOTLIB", "OPENCV", "NLP",
            "LLM", "HADOOP", "SPARK", "KAFKA", "AIRFLOW", "TABLEAU", "POWER BI", "LOOKER", "DBT",

            // testing and quality assurance
            "SELENIUM", "CYPRESS", "PLAYWRIGHT", "JEST", "MOCHA", "CHAI", "JUNIT", "TESTNG",
            "MOCKITO", "PYTEST", "CUCUMBER", "KARATE", "APPIUM", "POSTMAN", "SWAGGER",

            // methodologies, design tools and other skills
            "AGILE", "SCRUM", "KANBAN", "JIRA", "CONFLUENCE", "TRELLO", "ASANA", "NOTION",
            "FIGMA", "SKETCH", "ADOBE XD", "PHOTOSHOP", "ILLUSTRATOR", "SOLID", "TDD", "BDD",
            "CI/CD", "DEVOPS", "MICROSERVICES", "SERVERLESS", "REST", "SOAP", "OAUTH", "JWT"
    );
}