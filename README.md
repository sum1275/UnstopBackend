# UnstopBackend
UnstopBackend is a backend service for a seat reservation system. It provides endpoints for managing seat bookings and retrieving seat information.
## Installation
To install UnstopBackend, follow these steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/sum1275/UnstopBackend.git
   ## API Endpoints

The application provides the following endpoints:

- **Get All Seats**:
  - **Method**: `GET`
  - **Endpoint**: `http://localhost:8084/allseats`

- **Book a Seat**:
  - **Method**: `POST`
  - **Endpoint**: `http://localhost:8084/bookseat`
  - **Request Body**:
    ```json
    {
      "numberOfSeats": 7
    }
    ```

## Contributing

Contributions to UnstopBackend are welcome. 

