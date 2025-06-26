# API Specification v1.0

## General Rules

- Use UUID for all IDs
- Use enums for limited data types
- Use format for dates (DD-MM-YYYY)
- Use 24-hour format for time (HH:MM)
- Use Bearer token for authentication on protected endpoints
- Use multipart/form-data for file uploads
- Use JSON for request and response data
- Use pagination for list endpoints
- Use camelCase for JSON field names
- Response format must be consistent
- Use pnpm as package manager
- Use moment.js for date and time handling
- No rate limiting implementation
- No over-engineering
- No helmet.js usage
- Implement functional programe
- Use Xendit for payment processing
- if there are update on api , it must be update on swagger too !!

## Code Template

```javascript
const NameFunction = {
    // For async functions
    async nameFunction() {
        // implementation
    },
  
    // For regular functions
    function nameFunction() {
        // implementation
    }
}
module.exports = NameFunction
```

## File name

- use format like this

```js
 // if folder name services so file name must be exmaple?
    nameFile.service.js
```

## Backend Architecture

- MySQL as database
- Express.js as backend framework
- jsonwebtoken for authentication
- winston and morgan for logger
- Multer for file uploads
- Xendit for payment gateway
- Modular structure:
  - databases
    - factories
    - seeders
  - controllers
  - services
  - routes
  - middlewares
  - validations
  - libs

# General Features

## Login API

```yaml
endpoint: /api/v1/login
method: POST
request:
  email: string # required
  password: string # required

response:
  status: string # success or error
  message: string
  data:
    token: string # JWT token
    user:
      id: uuid
      fullName: string
      email: string
      role: string # BORROWER or ADMIN
```

## Register User API

```yaml
endpoint: /api/v1/register
method: POST
request:
  fullName: string # required
  email: string # required
  password: string # required
  borrowerType: enum USER_TYPE # required, enum: ['INTERNAL_UNAND', 'EXTERNAL_UNAND']
  phoneNumber: string # required
  bankName: string # required
  bankNumber: string # required

response:
  status: string # success or error
  message: string
  data:
    user:
      id: uuid
      fullName: string
      email: string
      role: string # BORROWER
```

## Profile Management API

### Get Profile

```yaml
endpoint: /api/v1/profile
method: GET
headers:
  Authorization: string # Bearer token

response:
  status: string # success or error
  message: string
  data:
    id: uuid
    fullName: string
    email: string
    phoneNumber: string
    borrowerType: enum USER_TYPE # INTERNAL_UNAND or EXTERNAL_UNAND
    bankName: string
    bankNumber: string
```

### Update Profile

```yaml
endpoint: /api/v1/profile
method: PATCH
headers:
  Authorization: string # Bearer token
  Content-Type: application/json

request:
  fullName: string # optional
  email: string # optional
  phoneNumber: string # optional
  borrowerType: enum USER_TYPE # optional
  bankName: string # optional
  bankNumber: string # optional

response:
  status: string # success or error
  message: string
  data:
    id: uuid
    fullName: string
    email: string
    phoneNumber: string
    borrowerType: enum USER_TYPE
    bankName: string
    bankNumber: string
```

# Building Features (No Authentication Required)

## Get Today's Bookings

```yaml
endpoint: /api/v1/bookings/today
method: GET

response:
  status: string # success or error
  message: string
  data:
    - id: uuid
      buildingName: string
      description: string
      startTime: string # format HH:MM
      endTime: string # format HH:MM
      status: string # APPROVED, PROCESSING, REJECTED, COMPLETED
```

## Check Building Availability

```yaml
endpoint: /api/v1/buildings/check-availability
method: POST
request:
  date: string # format DD-MM-YYYY, required
  time: string # format HH:MM, required

response:
  status: string # success or error
  message: string
  data:
    buildings:
      - id: uuid
        buildingName: string
        description: string
        rentalPrice: number
        buildingPhoto: string # URL
    totalAvailable: number
```

## Get Buildings with Filters

```yaml
endpoint: /api/v1/buildings
method: GET
query:
  search: string # optional
  buildingType: enum BUILDING_TYPE # optional
  page: number # optional, default 1
  limit: number # optional, default 10

response:
  status: string # success or error
  message: string
  data:
    - id: uuid
      buildingName: string
      description: string
      rentalPrice: number
      buildingPhoto: string # URL
      buildingType: enum BUILDING_TYPE
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

## Get Building Detail

```yaml
endpoint: /api/v1/buildings/{id}
method: GET

response:
  status: string # success or error
  message: string
  data:
    id: uuid
    buildingName: string
    description: string
    rentalPrice: number
    capacity: number
    location: string
    buildingPhoto: string # URL
    buildingType: enum BUILDING_TYPE
    facilities:
      - id: uuid
        facilityName: string
        iconUrl: string
    buildingManagers:
      - id: uuid
        managerName: string
        phoneNumber: string
    bookingSchedule:
      - id: uuid
        startDate: string # format DD-MM-YYYY
        endDate: string # format DD-MM-YYYY
        startTime: string # format HH:MM
        endTime: string # format HH:MM
        status: string # APPROVED, PROCESSING
        borrowerDetail:
          borrowerName: string
          activityName: string
```

## Get Building Schedule by Month

```yaml
endpoint: /api/v1/buildings/{id}/schedule
method: GET
query:
  month: number # optional, default current month
  year: number # optional, default current year

response:
  status: string # success or error
  message: string
  data:
    - id: uuid
      startDate: string # format DD-MM-YYYY
      endDate: string # format DD-MM-YYYY
      activityName: string
      startTime: string # format HH:MM
      endTime: string # format HH:MM
      status: string # APPROVED, PROCESSING, COMPLETED
      borrowerDetail:
        borrowerName: string
        buildingName: string
        buildingPhoto: string # URL
```

# User Features (Authentication Required)

## Create Booking

```yaml
endpoint: /api/v1/bookings
method: POST
headers:
  Authorization: string # Bearer token
  Content-Type: multipart/form-data

request:
  buildingId: uuid # required
  activityName: string # required
  startDate: string # required, format DD-MM-YYYY
  endDate: string # optional, format DD-MM-YYYY
  startTime: string # required, format HH:MM
  endTime: string # required, format HH:MM
  proposalLetter: file # required

response:
  status: string # success or error
  message: string
  data:
    bookingId: uuid
    buildingName: string
    startDate: string # format DD-MM-YYYY
    endDate: string # format DD-MM-YYYY
    startTime: string # format HH:MM
    endTime: string # format HH:MM
    status: string # PROCESSING
    payment:
      paymentUrl: string # Xendit payment URL
```

## Process Payment

```yaml
endpoint: /api/v1/bookings/{id}/payment
method: POST
headers:
  Authorization: string # Bearer token
  Content-Type: application/json

request:
  bookingId: uuid # required

response:
  status: string # success or error
  message: string
  data:
    paymentUrl: string # Xendit payment URL
    snapToken: string # Xendit snap token
```

## Get Booking History

```yaml
endpoint: /api/v1/bookings/history
method: GET
headers:
  Authorization: string # Bearer token
query:
  page: number # optional
  limit: number # optional

response:
  status: string # success or error
  message: string
  data:
    - bookingId: uuid
      buildingName: string
      startDate: string # format DD-MM-YYYY
      endDate: string # format DD-MM-YYYY
      startTime: string # format HH:MM
      endTime: string # format HH:MM
      status: string # APPROVED, PROCESSING, REJECTED, COMPLETED
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

## Get Transaction History

```yaml
endpoint: /api/v1/transactions/history
method: GET
headers:
  Authorization: string # Bearer token
query:
  page: number # optional
  limit: number # optional

response:
  status: string # success or error
  message: string
  data:
    - transactionId: uuid
      buildingName: string
      paymentDate: string # format DD-MM-YYYY
      totalAmount: number
      paymentStatus: string # PAID, UNPAID, PENDING, SETTLED, EXPIRED
      paymentMethod: string
      invoiceNumber: string
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

## Generate Invoice

```yaml
endpoint: /api/v1/bookings/{id}/invoice
method: GET
headers:
  Authorization: string # Bearer token

response:
  status: string # success or error
  message: string
  data:
    invoiceNumber: string
    date: string # format DD-MM-YYYY
    paymentMethod: string
    customer:
      borrowerName: string
      email: string
      phoneNumber: string
    item:
      buildingName: string
      startDate: string # format DD-MM-YYYY
      endDate: string # format DD-MM-YYYY
      startTime: string # format HH:MM
      endTime: string # format HH:MM
      totalAmount: number
```

## Get Notifications

```yaml
endpoint: /api/v1/notifications
method: GET
headers:
  Authorization: string # Bearer token
query:
  page: number # optional
  limit: number # optional

response:
  status: string # success or error
  message: string
  data:
    - notificationId: uuid
      title: string
      message: string
      date: string # format DD-MM-YYYY
      readStatus: boolean # true if read
      notificationType: string # PAYMENT or BOOKING
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

# Admin Features (Authentication Required - ADMIN Role)

## Dashboard Statistics - Bookings

```yaml
endpoint: /api/v1/dashboard/statistics/bookings
method: GET
headers:
  Authorization: string # Bearer token
query:
  month: number # optional, default current month
  year: number # optional, default current year

response:
  status: string # success or error
  message: string
  data:
    - buildingName: string
      totalBookings: number
```

## Dashboard Statistics - Transactions

```yaml
endpoint: /api/v1/dashboard/statistics/transactions
method: GET
headers:
  Authorization: string # Bearer token
query:
  month: number # optional, default current month
  year: number # optional, default current year

response:
  status: string # success or error
  message: string
  data:
    - month: string # format MM-YYYY
      totalTransactions: number
      totalRevenue: number
```

## Building Management

### Get Buildings (Admin)

```yaml
endpoint: /api/v1/admin/buildings
method: GET
headers:
  Authorization: string # Bearer token
query:
  page: number # optional
  limit: number # optional

response:
  status: string # success or error
  message: string
  data:
    - id: uuid
      buildingName: string
      description: string
      rentalPrice: number
      buildingType: enum BUILDING_TYPE
      location: string
      buildingPhoto: string # URL
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

### Create Building

```yaml
endpoint: /api/v1/admin/buildings
method: POST
headers:
  Authorization: string # Bearer token
  Content-Type: multipart/form-data

request:
  buildingName: string # required
  description: string # required
  rentalPrice: number # required
  capacity: number # required
  location: string # required
  buildingPhoto: file # required
  buildingType: enum BUILDING_TYPE # required
  facilities: array # optional
    - facilityName: string
      iconUrl: string
  buildingManagers: array # optional
    - managerName: string
      phoneNumber: string

response:
  status: string # success or error
  message: string
  data:
    id: uuid
    buildingName: string
    description: string
    rentalPrice: number
    capacity: number
    location: string
    buildingPhoto: string # URL
    buildingType: enum BUILDING_TYPE
    facilities:
      - id: uuid
        facilityName: string
        iconUrl: string
    buildingManagers:
      - id: uuid
        managerName: string
        phoneNumber: string
```

### Update Building

```yaml
endpoint: /api/v1/admin/buildings/{id}
method: PATCH
headers:
  Authorization: string # Bearer token
  Content-Type: multipart/form-data

request:
  buildingName: string # optional
  description: string # optional
  rentalPrice: number # optional
  capacity: number # optional
  location: string # optional
  buildingPhoto: file # optional
  buildingType: enum BUILDING_TYPE # optional
  facilities: array # optional
    - id: uuid # for existing
      facilityName: string
      iconUrl: string
  buildingManagers: array # optional
    - id: uuid # for existing
      managerName: string
      phoneNumber: string

response:
  status: string # success or error
  message: string
  data:
    # Same as create response
```

### Delete Building

```yaml
endpoint: /api/v1/admin/buildings/{id}
method: DELETE
headers:
  Authorization: string # Bearer token

response:
  status: string # success or error
  message: string
  data:
    id: uuid
    buildingName: string
```

## Booking Management

### Get Pending Bookings

```yaml
endpoint: /api/v1/admin/bookings
method: GET
headers:
  Authorization: string # Bearer token
query:
  status: enum BOOKING_STATUS # optional, default PROCESSING
  page: number # optional
  limit: number # optional

response:
  status: string # success or error
  message: string
  data:
    - bookingId: uuid
      buildingName: string
      activityName: string
      startDate: string # format DD-MM-YYYY
      endDate: string # format DD-MM-YYYY
      startTime: string # format HH:MM
      endTime: string # format HH:MM
      status: string
      borrowerName: string
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

### Approve/Reject Booking

```yaml
endpoint: /api/v1/admin/bookings/{id}/approval
method: PATCH
headers:
  Authorization: string # Bearer token
  Content-Type: application/json

request:
  bookingStatus: enum BOOKING_STATUS # required: APPROVED or REJECTED
  rejectionReason: string # required if REJECTED

response:
  status: string # success or error
  message: string
  data:
    bookingId: uuid
    buildingName: string
    startDate: string # format DD-MM-YYYY
    endDate: string # format DD-MM-YYYY
    startTime: string # format HH:MM
    endTime: string # format HH:MM
    status: string
```

## Transaction Management

### Get All Transactions

```yaml
endpoint: /api/v1/admin/transactions
method: GET
headers:
  Authorization: string # Bearer token
query:
  page: number # optional
  limit: number # optional

response:
  status: string # success or error
  message: string
  data:
    - transactionId: uuid
      buildingName: string
      paymentDate: string # format DD-MM-YYYY
      totalAmount: number
      paymentStatus: string
      paymentMethod: string
      invoiceNumber: string
      borrowerName: string
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

### Export Transactions to Excel

```yaml
endpoint: /api/v1/admin/transactions/export
method: GET
headers:
  Authorization: string # Bearer token
query:
  month: number # optional, default current month
  year: number # optional, default current year

response:
  status: string # success or error
  message: string
  data:
    fileUrl: string # URL to download Excel file
```

### Get Booking History with Filters

```yaml
endpoint: /api/v1/admin/bookings/history
method: GET
headers:
  Authorization: string # Bearer token
query:
  buildingId: uuid # optional
  startDate: string # optional, format DD-MM-YYYY
  endDate: string # optional, format DD-MM-YYYY
  page: number # optional
  limit: number # optional

response:
  status: string # success or error
  message: string
  data:
    - bookingId: uuid
      buildingName: string
      activityName: string
      startDate: string # format DD-MM-YYYY
      endDate: string # format DD-MM-YYYY
      startTime: string # format HH:MM
      endTime: string # format HH:MM
      status: string
      borrowerName: string
  pagination:
    totalItems: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
```

### Process Refund

```yaml
endpoint: /api/v1/admin/bookings/{id}/refund
method: POST
headers:
  Authorization: string # Bearer token
  Content-Type: application/json

request:
  refundReason: string # required

response:
  status: string # success or error
  message: string
  data:
    refundId: uuid
    paymentId: uuid
    refundAmount: number
    refundStatus: string # SUCCEEDED, FAILED, PENDING
    refundDate: string # format DD-MM-YYYY
```

## Enums Reference

```yaml
USER_TYPE:
  - INTERNAL_UNAND
  - EXTERNAL_UNAND

ROLE:
  - BORROWER
  - ADMIN

BUILDING_TYPE:
  - CLASSROOM
  - PKM
  - LABORATORY
  - MULTIFUNCTION
  - SEMINAR

BOOKING_STATUS:
  - PROCESSING
  - APPROVED
  - REJECTED
  - COMPLETED

TRANSACTION_STATUS:
  - UNPAID
  - PAID
  - PENDING
  - SETTLED
  - EXPIRED
  - ACTIVE
  - STOPPED

REFUND_STATUS:
  - SUCCEEDED
  - FAILED
  - PENDING

NOTIFICATION_TYPE:
  - PAYMENT
  - BOOKING
```
