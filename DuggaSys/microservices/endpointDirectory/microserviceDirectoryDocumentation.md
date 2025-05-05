# Endpoint Directory Database Setup Tutorial
There are two ways to install the Endpoint Directory database. The 'scripted installation' and the 'manual installation', both of these has the same endresult. Below are step by step guides on how to use both. 

The scripted installation combines the step of the manual installation in a script - which means that you don't need to run them yourself. Use this guide if you just need the database and it's data.

### Scripted installation
1. Open your [LenaSYS](http://localhost/LenaSYS) directory and navigate to the [endpointDirectory](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/) folder. (LenaSYS/DuggaSys/microservices/endpointDirectory)
2. In the endpointDirectory folder, open [setupEndpointDirectory.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/setupEndpointDirectory.php) - This script will first remove the database (if you have it). It will then run the steps in the manual mode - install the database and then populate it. (See the manual installation guide if you are interested in the specifics of the steps)
3. To ensure that the setup has been successful and that it has been populated with data you can visit [microserviceUI.php](http://localhost/LenaSYS/DuggaSys/microservices/endpointDirectory/microserviceUI.php) and check if there is any data.

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

### outputs
| Field | Type | Description |
| ------ | ------ | ------ |
| id | INTEGER | Primary key, auto incrementing integer |
| microservice_id | INTEGER | Foreign key that references id in microservice |
| output_name | TEXT | Name of the output |
| output_type | TEXT | Datatype of the output (string, int etc.) |
| output_description | TEXT | Description of the output |

Relationships: One-to-many relationship to microservices(id) via microservice_id.

### dependencies
| Field | Type | Description |
| ------ | ------ | ------ |
| dependency_id | INTEGER | Primary key, auto incrementing integer |
| ms_name | TEXT | Name of the microservice that depends on another microservice |
| depends_on | TEXT | Name of the microservice that ms_name depends on |
| path | TEXT | Searchpath to the microservice (depends_on) |

Relationships: No relationships.