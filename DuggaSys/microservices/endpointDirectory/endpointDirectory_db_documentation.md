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