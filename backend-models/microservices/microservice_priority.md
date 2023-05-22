# Priority list for microservice implementation



## __Priority List__
1. `courseedservice`
2. `sectionedservice`
3. `showDuggaservice`
4. `fileedservice`
5. `codeviewerService`
6. `duggaedservice`
7. `resultedservice`-- unsure if working
8. `diagramservice` --- depending on when it is ready, may take higher priority
9. `accessedservice` -- unclear if used
10. `profileservice` -- unclear if used
11. `contributedservice` -- unclear if used
12. `contribution_loginbox_service` -- unclear if used
13. `highscoreservice` -- unclear if used

Main usage of LenaSYS would be from `courseedservice`/`sectionedservice`. As such these should be prioritized when converting them microservices. I believe it would be reasonable to start with `courseedservice` since it is a bit smaller, and therefore they may help in the design of the following services.

The following services: `showDuggaservice`, `fileedservice`, `codeviewerService`, `duggaedservice`, `resultedservice` are all part of courses. They are only accessed from inside a course. `resultedservice` is unclear if it works as intended since giving the hash to access a dugga doesn't work.

`diagramservice` may take higher priority, this is dependent on if the service file is working as intended. Since there is concurrent work being done with this service it is hard to determine if an architectural change is appropriate as of now, therefore it is not set higher in the list.

The following services are unclear if they are used, and how they are used: `accessedservice`, `profileservice`, `contributedservice`, `contribution_loginbox_service`, `highscoreservice`
