# Endpoint Directory Database Setup Tutorial

There are two ways to install the Endpoint Directory database: **scripted installation** and **manual installation**. Both methods result in the same outcome. Below are step-by-step guides for each.

The scripted installation wraps the steps of the manual installation into a single script — meaning you don't need to run them individually. Use this method if you simply need the database and its data.

### Scripted installation

1. Open your [LenaSYS](http://localhost/LenaSYS) directory and navigate to the [endpointDirectory](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/) folder.
2. In the endpointDirectory folder, open [setupEndpointDirectory.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/setupEndpointDirectory.php).  
   This script will first remove the database if it exists. It then performs the steps of the manual installation: creating and populating the database.  
   (Refer to the manual installation section for details on what the script does.)
3. To verify that the setup was successful and that the database contains data, visit [microserviceUI.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/microserviceUI.php).

### Manual installation

1. Open your [LenaSYS](http://localhost/LenaSYS) directory and navigate to the [endpointDirectory](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/) folder.
2. In the endpointDirectory folder, open [installEndpointDb.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/installEndpointDb.php).  
   This script installs an empty SQLite database with [these tables](#-Endpoint-Directory-Database-Table-Documentation).  
   After running it, you should see a file named `endpointDirectory_db.sqlite` in the endpointDirectory folder.  
   If you need to reinstall the database (for example, if it has been changed), manually delete this file before rerunning the script.
3. To populate the database with data, run the following two scripts, also found in the endpointDirectory folder:
   - [fillEndpointDb.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/fillEndpointDb.php) — fills the database with microservice documentation.
   - [fillDependenciesDb.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/fillDependenciesDb.php) — fills the database with dependencies documentation.  
     These can be run in any order.
4. To confirm that the database has been set up and populated, visit [microserviceUI.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/microserviceUI.php).

# Endpoint Directory Database Table Documentation
## Tables
- microservices
- parameters
- outputs
- dependencies

## Table documentation
### microservices
| Field | Type | Description |
| ------ | ------ | ------ |
| id | INTEGER | Primary key, auto incrementing integer |
| ms_name | TEXT | Name of the microservice |
| description | TEXT | Description of what the microservice does |
| calling_methods | TEXT | A list of calling methods, seperated by a "," |
| microservices_used | TEXT | A list of other microservices that this microservice use, seperated by a "," |

Relationships: No relationships, but other tables references to microservices(id).

### parameters
| Field | Type | Description |
| ------ | ------ | ------ |
| id | INTEGER | Primary key, auto incrementing integer |
| microservice_id | INTEGER | Foreign key that references id in microservice |
| parameter_name | TEXT | Name of the parameter |
| parameter_type | TEXT | Datatype of the parameter (string, int etc.) |
| parameter_description | TEXT | Description of what the parameter does |

Relationships: One-to-many relationship to microservices(id) via microservice_id.
- microservice_id referenses microservice(id)

### outputs
| Field | Type | Description |
| ------ | ------ | ------ |
| id | INTEGER | Primary key, auto incrementing integer |
| microservice_id | INTEGER | Foreign key that references id in microservice |
| output_name | TEXT | Name of the output |
| output_type | TEXT | Datatype of the output (string, int etc.) |
| output_description | TEXT | Description of the output |

Relationships: One-to-many relationship to microservices(id) via microservice_id.
- microservice_id referenses microservice(id)

### dependencies
| Field | Type | Description |
| ------ | ------ | ------ |
| dependency_id | INTEGER | Primary key, auto incrementing integer |
| microservice_id | INTEGER | Foreign key to microservices.id, refers to the microservice that depends on another microservice |
| depends_on_id | INTEGER | Foreign key to microservices.id, refers to the microservice that the microservice depends on |
| ms_name | TEXT | Name of the microservice that depends on another microservice |
| depends_on | TEXT | Name of the microservice that ms_name depends on |
| path | TEXT | Searchpath to the microservice (depends_on) |

Relationships: microservice_id and depends_on_id refers to entries in microservice table (these can be null) 
- microservice_id referenses microservice(id)
- depends_on_id referenses microservice(id)