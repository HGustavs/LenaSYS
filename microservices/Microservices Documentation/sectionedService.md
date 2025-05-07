# Microservice Documentation: sectionedService

## `readCourseGroupsAndMembers_ms.php`

**Location:** `DuggaSys/microservices/sectionedService/readCourseGroupsAndMembers_ms.php`

### 1. HTTP Method & Endpoint

*   **Method:** `GET` (assumed, could be `POST`)
*   **Endpoint:** `/sectionedService/readCourseGroupsAndMembers` (exact endpoint might vary based on routing configuration)

### 2. Description

Retrieves a list of group members related to a specified course ID and course version. Can filter by a specific group. This service also relies on `retrieveSectionedService_ms.php`, the details of which are not fully known from the provided snippet.

### 3. Request Parameters

| Parameter    | Type   | Location    | Required | Description                                                                 |
|--------------|--------|-------------|----------|-----------------------------------------------------------------------------|
| `opt`        | String | Query/Body  | Yes      | Operation type. Set to `GRP` to fetch group members. Other options unknown. |
| `courseid`   | String | Query/Body  | Yes      | The ID of the course.                                                       |
| `coursevers` | String | Query/Body  | Yes      | The version of the course.                                                  |
| `log_uuid`   | String | Query/Body  | Yes      | A UUID for logging purposes.                                                |
| `showgrp`    | String | Query/Body  | No       | Specifies the group(s) to retrieve members from (e.g., "GRPA,GRPB").        |

### 4. SQL Queries & Tables Touched

*   **If `opt=GRP`:**
    ```sql
    SELECT user.uid, user.username, user.firstname, user.lastname, user.email, user_course.groups
    FROM user, user_course
    WHERE user.uid = user_course.uid
      AND user_course.cid = :cid
      AND user_course.vers = :vers;
    ```
*   **Tables:** `user`, `user_course`.
*   **Note:** Additional queries might be executed by the included `retrieveSectionedService_ms.php`.

### 5. Authentication & Authorization

*   Requires an active user session (`checklogin()`).
*   The user must have at least read access (`'r'`) to the specified course (`hasAccess($userid, $courseid, 'r')`).
*   Student/teacher (`'st'`) and write (`'w'`) access are also checked, but their impact on this specific `GRP` operation is not detailed in the snippet.

### 6. Response Schema

The response is a JSON object. The exact structure depends heavily on the output of `retrieveSectionedService_ms.php`, which is merged with the fields below.

*   `grplst` (Array of Arrays): List of members in the specified group(s).
    *   Each inner array: `[group_name (String), firstname (String), lastname (String), email (String)]`
    *   Example: `["GRP1", "John", "Doe", "john.doe@example.com"]`
*   `grpmembershp` (String): The `groups` attribute of the last user processed in the database query when `opt=GRP`. *Note: This might not represent all applicable groups if multiple are involved.*
*   **Other fields:** The response will include fields returned by `retrieveSectionedService_ms.php`. These are unknown.

**Example Request (`opt=GRP`):**

```
GET /sectionedService/readCourseGroupsAndMembers?opt=GRP&courseid=123&coursevers=2024A&showgrp=TEAM1&log_uuid=xxxx-xxxx-xxxx-xxxx
```

**Example Response (Partial, actual structure depends on `retrieveSectionedService_ms.php`):**

```json
{
  // Fields from retrieveSectionedService_ms.php would be here
  "grplst": [
    ["TEAM1", "Alice", "Wonderland", "alice@example.com"],
    ["TEAM1", "Bob", "Builder", "bob@student.his.se"]
  ],
  "grpmembershp": "TEAM1", // Value from the last processed user
  "debug": "NONE!" // Or an error message if applicable
  // Potentially other fields like 'access', 'courseid', 'coursevers' from retrieveSectionedService
}
```

### 7. Error Handling

*   If the database query for group members fails (when `opt=GRP`), a debug message "Failed to get group members!" is set internally. How this is presented to the user depends on `retrieveSectionedService_ms.php`.
*   Other error handling (e.g., for invalid parameters, auth failures) is likely handled by `basic.php` or `retrieveSectionedService_ms.php`, but details are not available from the snippet.

### 8. Side Effects / Notes

*   Starts a PHP session.
*   Sets default timezone to "Europe/Stockholm".
*   Includes `../../../Shared/basic.php`, `../../../Shared/sessions.php`, and `./retrieveSectionedService_ms.php`. The functionality of `retrieveSectionedService_ms.php` is critical to understanding the full behavior and response of this microservice.
*   If a user's email is `NULL` in the database, it's constructed as `username@student.his.se`.

---

## `readCourseVersions_ms.php`

**Location:** `DuggaSys/microservices/sectionedService/readCourseVersions_ms.php`

### 1. HTTP Method & Endpoint

*   **Method:** `GET` (assumed, as no request parameters are processed for the main functionality)
*   **Endpoint:** `/sectionedService/readCourseVersions` (exact endpoint might vary based on routing configuration)

### 2. Description

Fetches a list of all available course versions from the system.

### 3. Request Parameters

*   None identified in the provided snippet for the primary functionality of listing all versions.

### 4. SQL Queries & Tables Touched

*   **Query:**
    ```sql
    SELECT cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate, motd
    FROM vers;
    ```
*   **Table:** `vers`.

### 5. Authentication & Authorization

*   Starts a PHP session.
*   Includes `../sharedMicroservices/getUid_ms.php`, which might perform authentication/session checks.
*   The provided snippet does not show explicit calls to `checklogin()` or `hasAccess()` for the main data fetching query, but these could be handled by included files or globally.

### 6. Response Schema

The response is a JSON array of objects, where each object represents a course version.

*   **Object fields:**
    *   `cid` (String/Number): Course ID.
    *   `coursecode` (String): Course code (e.g., "ITF101").
    *   `vers` (String/Number): Version identifier (e.g., "2024A", "1001").
    *   `versname` (String): Descriptive name of the version (e.g., "Spring 2024").
    *   `coursename` (String): Official name of the course.
    *   `coursenamealt` (String, nullable): Alternative name for the course.
    *   `startdate` (String - Date/DateTime): Start date of the course version.
    *   `enddate` (String - Date/DateTime): End date of the course version.
    *   `motd` (String, nullable): Message of the day for the course version.

**Example Request:**

```
GET /sectionedService/readCourseVersions
```

**Example Response:**

```json
[
  {
    "cid": "1",
    "coursecode": "IT101",
    "vers": "2024A",
    "versname": "Spring 2024",
    "coursename": "Introduction to IT",
    "coursenamealt": "Intro IT",
    "startdate": "2024-01-15",
    "enddate": "2024-06-01",
    "motd": "Welcome to the course!"
  },
  {
    "cid": "2",
    "coursecode": "MA202",
    "vers": "V23",
    "versname": "Autumn 2023",
    "coursename": "Calculus II",
    "coursenamealt": null,
    "startdate": "2023-09-01",
    "enddate": "2023-12-20",
    "motd": null
  }
]
```

### 7. Error Handling

*   If a `PDOException` occurs during the database query, an error message is logged server-side (e.g., "Error reading versions: [PDO error message]").
*   The script will then attempt to `json_encode` the `$versions` array. If the error occurred before fetching any data, this would likely result in an empty JSON array `[]` being returned to the client. No specific HTTP error status is set in the snippet.

### 8. Side Effects / Notes

*   Starts a PHP session.
*   Sets default timezone to "Europe/Stockholm".
*   Includes `../../../Shared/basic.php`, `../../../Shared/sessions.php`, and `../sharedMicroservices/getUid_ms.php`.
*   The service returns all versions; there's no pagination or filtering visible in the snippet. 