# JWT Pizza Penetration Test Report

## Tester Information

Name: David Bauch
Date: April 14, 2025

## Self-Attack Records

### Attack 1: Client-Side Token Storage

| Item           | Result                                                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 12, 2025                                                                                                                                                                                  |
| Target         | jwt-pizza deployment                                                                                                                                                                            |
| Classification | Broken Authentication (OWASP A2:2021)                                                                                                                                                           |
| Severity       | 2 (High)                                                                                                                                                                                        |
| Description    | Authentication tokens are stored in localStorage, making them vulnerable to XSS attacks. Tokens are accessible via JavaScript and persist after session ends.                                   |
| Images         | ![Screenshot 2025-04-12 at 01.03.28](screenshots/Screenshot%202025-04-12%20at%2001.03.28.png) <br>![Screenshot 2025-04-12 at 01.03.36](screenshots/Screenshot%202025-04-12%20at%2001.03.36.png) |
| Corrections    | 1. Move token storage to HttpOnly cookies                                                                                                                                                       |

                  2. Implement proper session management
                  3. Add token expiration checks                   |

### Attack 2: Information Leakage Through Error Messages

| Item           | Result                                                                                                                                                                                                                                                                                                                                         |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 12, 2025                                                                                                                                                                                                                                                                                                                                 |
| Target         | jwt-pizza deployment                                                                                                                                                                                                                                                                                                                           |
| Classification | Security Misconfiguration (OWASP A5:2021)                                                                                                                                                                                                                                                                                                      |
| Severity       | 3 (Medium)                                                                                                                                                                                                                                                                                                                                     |
| Description    | API endpoints leak internal implementation details through error messages. For example, attempting to create a franchise returns "franchise.admins is not iterable", revealing internal object structure and validation logic. This information can be used to understand the application's internal workings and craft more targeted attacks. |
| Images         | ![Screenshot 2025-04-12 at 18.43.02](screenshots/Screenshot%202025-04-12%20at%2018.43.02.png)                                                                                                                                                                                                                                                  |
| Corrections    | 1. Implement proper error handling middleware                                                                                                                                                                                                                                                                                                  |

                  2. Return generic error messages to clients
                  3. Log detailed errors server-side only
                  4. Sanitize all error responses                 |

## Peer-Attack Records

### Attack 1: Privilege Escalation via User Update Endpoint

| Item           | Result                                                                                                                                                                                                                                                                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | April 14, 2025                                                                                                                                                                                                                                                                                                    |
| Target         | jwt-pizza deployment                                                                                                                                                                                                                                                                                              |
| Classification | Broken Access Control (OWASP A1:2021)                                                                                                                                                                                                                                                                             |
| Severity       | 2 (High)                                                                                                                                                                                                                                                                                                          |
| Description    | The `/api/auth/:userId` endpoint allows a user to attempt to update another user's account by specifying their userId in the URL. A regular user can attempt to update another user's email or password. If access controls are not properly enforced, this could allow privilege escalation or account takeover. |
| Images         | ![Screenshot 2025-04-14 at 21.48.02](screenshots/Screenshot%202025-04-14%20at%2021.48.02.png)                                                                                                                                                                                                                     |
| Corrections    | 1. Ensure strict server-side access control checks so only the account owner or an admin can update a user's info.<br>2. Add tests for privilege escalation attempts.<br>3. Return clear but generic error messages for unauthorized attempts.                                                                    |

## Lessons Learned

1. Use the authorzation token for all user validation
2. Use cookies that are controlled by HTTP, which the server can control. Not localstorage.
3. Be careful about which request parameters can be used to modify server-side objects
4. There should be limits set in place to prevent high frequency attacks from a single source/user
