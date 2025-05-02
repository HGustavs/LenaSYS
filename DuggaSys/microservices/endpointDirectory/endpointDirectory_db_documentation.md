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