# Register Form Implementation

This document explains the updated register form implementation that integrates with the Building Rental API.

## API Integration

### Endpoint
```
POST /api/v1/auth/register
```

### Request Headers
```
Content-Type: application/json
Accept: application/json
```

### Request Body
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com", 
  "password": "Password123!",
  "borrowerType": "EXTERNAL_UNAND",
  "phoneNumber": "+62812345678",
  "bankName": "Bank BCA",
  "bankNumber": "1234567890"
}
```

### Response (201 Created)
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "571589ec-5b9f-41ce-afde-2c81dcab07eb",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "role": "BORROWER"
  }
}
```

## Form Fields

### 1. **fullName** (Required)
- **Type**: String
- **Validation**: Required, trimmed
- **Description**: Full name of the user
- **Example**: "John Doe"

### 2. **borrowerType** (Required)
- **Type**: Enum
- **Options**:
  - `INTERNAL_UNAND` - Civitas Akademika Unand
  - `EXTERNAL_UNAND` - Eksternal Unand
  - `GOVERNMENT` - Pemerintah
  - `PRIVATE` - Swasta  
  - `INDIVIDUAL` - Perorangan
- **Description**: Type of borrower/user

### 3. **email** (Required)
- **Type**: Email
- **Validation**: Required, valid email format
- **Description**: User's email address
- **Example**: "john.doe@example.com"

### 4. **password** (Required)
- **Type**: String
- **Validation**: Minimum 6 characters
- **Description**: User's password
- **Security**: Hidden input with toggle visibility

### 5. **phoneNumber** (Required)
- **Type**: String
- **Validation**: Indonesian phone number format
- **Format**: `+62812345678` or `0812345678`
- **Auto-formatting**: Converts `0` prefix to `+62`
- **Description**: User's phone number

### 6. **bankName** (Required)
- **Type**: String (Select)
- **Options**:
  - Bank BCA
  - Bank BRI
  - Bank BNI
  - Bank Mandiri
  - Bank BTN
  - Bank CIMB Niaga
  - Bank Danamon
  - Bank Permata
  - Bank Maybank
  - Bank OCBC NISP
  - BSI (Bank Syariah Indonesia)
  - Bank Muamalat
- **Description**: User's bank name

### 7. **bankNumber** (Required)
- **Type**: String (Numbers only)
- **Validation**: 6-20 digits
- **Auto-formatting**: Only allows numeric input
- **Description**: User's bank account number

## Validation Rules

### Client-side Validation
```javascript
// Required fields check
if (!formData.fullName.trim()) {
    throw new Error('Nama lengkap harus diisi');
}

// Email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
    throw new Error('Format email tidak valid');
}

// Password validation
if (formData.password.length < 6) {
    throw new Error('Password harus minimal 6 karakter');
}

// Phone number validation
const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;
if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
    throw new Error('Format nomor telepon tidak valid');
}

// Bank account validation
const bankNumberRegex = /^[0-9]{6,20}$/;
if (!bankNumberRegex.test(formData.bankNumber)) {
    throw new Error('Nomor rekening harus berupa angka 6-20 digit');
}
```

### Input Formatting
```javascript
// Phone number formatting
if (name === 'phoneNumber') {
    formattedValue = value.replace(/[^\d+]/g, '');
    if (formattedValue.startsWith('0')) {
        formattedValue = '+62' + formattedValue.substring(1);
    }
}

// Bank number formatting
if (name === 'bankNumber') {
    formattedValue = value.replace(/\D/g, '');
}

// Name formatting
if (name === 'fullName') {
    formattedValue = value.replace(/\s+/g, ' ');
}
```

## Error Handling

### Client-side Errors
- **Validation errors**: Displayed as toast notifications
- **Format errors**: Real-time validation feedback
- **Required field errors**: Prevents form submission

### API Errors
```javascript
// Handle different HTTP status codes
if (error.status === 400) {
    errorMessage = "Data yang dikirim tidak valid";
} else if (error.status === 409) {
    errorMessage = "Email sudah terdaftar. Silakan gunakan email lain.";
} else if (error.status === 500) {
    errorMessage = "Terjadi kesalahan pada server";
}
```

## Usage Examples

### 1. Basic Implementation
```jsx
import RegisterForm from './components/auth/RegisterForm';
import { useRegister } from './hooks/useRegister';

const RegisterPage = () => {
    const registerHook = useRegister();
    
    return (
        <div>
            <RegisterForm {...registerHook} />
        </div>
    );
};
```

### 2. Custom Styling
```jsx
<Box
    bg="white"
    p={8}
    borderRadius="20px"
    boxShadow="0 8px 32px rgba(116, 156, 115, 0.15)"
>
    <RegisterForm {...registerHook} />
</Box>
```

### 3. With Custom Success Handling
```jsx
const useCustomRegister = () => {
    const register = useRegister();
    
    const handleSubmit = async (e) => {
        const success = await register.handleSubmit(e);
        if (success) {
            // Custom success logic
            analytics.track('user_registered');
            redirectToWelcomePage();
        }
    };
    
    return {
        ...register,
        handleSubmit
    };
};
```

## Component Files

### 1. **RegisterForm.jsx**
- UI component for the registration form
- Handles form display and user interaction
- Includes validation feedback and helper text

### 2. **useRegister.js**
- Custom hook for registration logic
- Handles form state management
- Implements validation and API calls
- Manages loading states and error handling

### 3. **RegisterDemo.jsx**
- Demo component for testing and documentation
- Shows example usage and API integration
- Includes validation examples

## Testing

### Manual Testing Checklist
- [ ] All required fields validation
- [ ] Email format validation  
- [ ] Phone number formatting (+62 conversion)
- [ ] Bank number numeric-only input
- [ ] Password visibility toggle
- [ ] Form submission with valid data
- [ ] Error handling for invalid data
- [ ] Success notification and redirect
- [ ] API integration testing

### Test Data
```javascript
const testData = {
    valid: {
        fullName: "John Doe",
        borrowerType: "EXTERNAL_UNAND",
        email: "john.doe@example.com",
        password: "Password123!",
        phoneNumber: "+62812345678",
        bankName: "Bank BCA",
        bankNumber: "1234567890"
    },
    invalid: {
        email: "invalid-email",
        password: "123", // Too short
        phoneNumber: "123", // Invalid format
        bankNumber: "abc123" // Contains letters
    }
};
```

## Security Considerations

1. **Client-side validation is for UX only** - Server-side validation is required
2. **Password handling** - Never log or store passwords in plain text
3. **Email verification** - Consider implementing email verification flow
4. **Rate limiting** - Implement registration rate limiting on server
5. **Input sanitization** - All inputs are trimmed and formatted

## Future Enhancements

1. **Email verification** - Add email verification step
2. **Password strength indicator** - Visual password strength meter
3. **Terms and conditions** - Add terms acceptance checkbox
4. **Social registration** - Add Google/Facebook registration options
5. **Multi-step form** - Break into multiple steps for better UX 