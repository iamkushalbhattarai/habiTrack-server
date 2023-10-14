# Endpoints

## User


## Habit

| Endpoint          | Method       | Query params | Description                                     | Remarks                |
|-------------------|--------------|--------------|-------------------------------------------------|------------------------|
| `/habit`          | `POST`       | --           | Create a new habit for the user                 | --                     |
| `/habit/update`   | `PUT`/`POST` | --           | Update an existing habit of the user            | --                     |
| `/habit/`         | `GET`        | --           | Get all habits for the user                     | --                     |
| `/habit/:habitId` | `GET`        | --           | Get a habit by the id which belongs to the user | --                     |
| `/habit/:habitId` | `DELETE`     | --           | Delete a habit for the user                     | Might not be available |

## Habit Log

| Endpoint                      | Method       | Query params                                                               | Description                                                                                                                                                                                                                | Remarks                |
|-------------------------------|--------------|----------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------|
| `/habit-log`                  | `POST`       | --                                                                         | Create a new habit log for the habit                                                                                                                                                                                       | --                     |
| `/habit-log/update`           | `PUT`/`POST` | --                                                                         | Update an existing habit log of a habit                                                                                                                                                                                    | --                     |
| `/habit-log/habit/:habitId`   | `GET`        | `habitId`:  Id of the habit                                                | Get the habit logs by the id of a habit                                                                                                                                                                                    | --                     |
| `/habit-log/:period/:habitId` | `GET`        | `:period`: `'day', 'week', 'month','year'  `?reversePeriodIndex`: `number` | Get the habit logs for a given period. `/habit-log/day/:habitId?reversePeriodIndex=0` is the todays habit log for the habit   `/habit-log/day/:habitId?reversePeriodIndex=1` is the previous days' habit log for the habit | --                     |
| `/habit-log/:habitId`         | `DELETE`     | `habitId`: Id of the habit                                                 | Delete a habit log of a habit                                                                                                                                                                                              | Might not be available |